import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { BatchImage, BatchQueueState, ProcessingStatus } from '@/types/batch';

interface BatchQueueContextType {
  state: BatchQueueState;
  addImages: (uris: string[]) => void;
  removeImage: (id: string) => void;
  updateImageStatus: (id: string, status: ProcessingStatus, resultUri?: string | null, error?: string | null) => void;
  setCurrentIndex: (index: number) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  resetQueue: () => void;
}

const BatchQueueContext = createContext<BatchQueueContextType | undefined>(undefined);

export function BatchQueueProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BatchQueueState>({
    images: [],
    currentIndex: 0,
    isProcessing: false,
    isPaused: false,
  });

  const addImages = useCallback((uris: string[]) => {
    const newImages: BatchImage[] = uris.map(uri => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      originalUri: uri,
      resultUri: null,
      status: 'pending' as ProcessingStatus,
      error: null,
      timestamp: Date.now(),
    }));

    setState(prev => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  }, []);

  const removeImage = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id),
    }));
  }, []);

  const updateImageStatus = useCallback((
    id: string,
    status: ProcessingStatus,
    resultUri?: string | null,
    error?: string | null
  ) => {
    setState(prev => ({
      ...prev,
      images: prev.images.map(img =>
        img.id === id
          ? { ...img, status, resultUri: resultUri ?? img.resultUri, error: error ?? img.error }
          : img
      ),
    }));
  }, []);

  const setCurrentIndex = useCallback((index: number) => {
    setState(prev => ({ ...prev, currentIndex: index }));
  }, []);

  const setIsProcessing = useCallback((isProcessing: boolean) => {
    setState(prev => ({ ...prev, isProcessing }));
  }, []);

  const setIsPaused = useCallback((isPaused: boolean) => {
    setState(prev => ({ ...prev, isPaused }));
  }, []);

  const resetQueue = useCallback(() => {
    setState({
      images: [],
      currentIndex: 0,
      isProcessing: false,
      isPaused: false,
    });
  }, []);

  const value: BatchQueueContextType = {
    state,
    addImages,
    removeImage,
    updateImageStatus,
    setCurrentIndex,
    setIsProcessing,
    setIsPaused,
    resetQueue,
  };

  return (
    <BatchQueueContext.Provider value={value}>
      {children}
    </BatchQueueContext.Provider>
  );
}

export function useBatchQueue() {
  const context = useContext(BatchQueueContext);
  if (context === undefined) {
    throw new Error('useBatchQueue must be used within a BatchQueueProvider');
  }
  return context;
}
