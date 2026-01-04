import { getApiUrl } from './query-client';

export interface ProcessingCallbacks {
  onImageStart?: (index: number) => void;
  onImageComplete?: (index: number, resultUri: string) => void;
  onImageError?: (index: number, error: string) => void;
  onProgress?: (current: number, total: number) => void;
  onQueueComplete?: (successCount: number, failureCount: number) => void;
}

export interface ProcessImageResult {
  success: boolean;
  resultUri?: string;
  error?: string;
}

export class BatchProcessor {
  private isPaused = false;
  private isCancelled = false;

  /**
   * Process a single image through the API
   * Reuses the same logic as PreviewScreen.handleGenerate
   */
  async processSingleImage(imageUri: string): Promise<ProcessImageResult> {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        name: 'product_photo.jpg',
        type: 'image/jpeg',
      } as unknown as Blob);

      const apiUrl = getApiUrl();
      const endpoint = `${apiUrl}api/amazon-main`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout

      let response: Response;
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to process image');
      }

      const blob = await response.blob();

      // Convert blob to base64 data URL
      const base64data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read processed image'));
        reader.readAsDataURL(blob);
      });

      return {
        success: true,
        resultUri: base64data,
      };
    } catch (err) {
      let errorMessage = 'An unexpected error occurred';

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Request timed out. Please try again.';
        } else if (err.message.includes('Network request failed') || err.message.includes('TypeError')) {
          errorMessage = 'Unable to connect to server. Please check your connection.';
        } else {
          errorMessage = err.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Process a queue of images sequentially
   */
  async processQueue(
    imageUris: string[],
    callbacks: ProcessingCallbacks = {}
  ): Promise<void> {
    this.isPaused = false;
    this.isCancelled = false;

    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < imageUris.length; i++) {
      // Check if cancelled
      if (this.isCancelled) {
        break;
      }

      // Wait while paused
      while (this.isPaused && !this.isCancelled) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Check again after pause
      if (this.isCancelled) {
        break;
      }

      // Notify image start
      callbacks.onImageStart?.(i);
      callbacks.onProgress?.(i + 1, imageUris.length);

      // Process the image
      const result = await this.processSingleImage(imageUris[i]);

      if (result.success && result.resultUri) {
        successCount++;
        callbacks.onImageComplete?.(i, result.resultUri);
      } else {
        failureCount++;
        callbacks.onImageError?.(i, result.error || 'Unknown error');
      }
    }

    // Notify queue complete
    callbacks.onQueueComplete?.(successCount, failureCount);
  }

  /**
   * Pause the queue processing
   */
  pause(): void {
    this.isPaused = true;
  }

  /**
   * Resume the queue processing
   */
  resume(): void {
    this.isPaused = false;
  }

  /**
   * Cancel the queue processing
   */
  cancel(): void {
    this.isCancelled = true;
    this.isPaused = false;
  }

  /**
   * Check if the processor is currently paused
   */
  isPausedState(): boolean {
    return this.isPaused;
  }

  /**
   * Check if the processor has been cancelled
   */
  isCancelledState(): boolean {
    return this.isCancelled;
  }
}
