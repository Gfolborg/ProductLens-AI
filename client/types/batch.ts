export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface BatchImage {
  id: string;
  originalUri: string;
  resultUri: string | null;
  status: ProcessingStatus;
  error: string | null;
  timestamp: number;
}

export interface BatchQueueState {
  images: BatchImage[];
  currentIndex: number;
  isProcessing: boolean;
  isPaused: boolean;
}
