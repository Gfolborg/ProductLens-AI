/**
 * 🎉 Copy & Personality Constants
 * Centralized fun, energetic messaging for the app
 */

// 📸 Camera Screen
export const CameraCopy = {
  title: "Let's Create Magic ✨",
  batchModeTitle: (count: number) => `${count} photos captured! 🔥`,
  uploadButton: "Upload",
  multipleButton: "Multiple",
  batchDoneButton: "Done",
  batchCancelButton: "Cancel",

  permissions: {
    title: "Enable Camera",
    denied: "Camera Access Required",
    message: "To capture product photos, we need access to your camera.",
    deniedMessage: "Please enable camera access in your device settings to capture product photos.",
    enableButton: "Enable Camera",
    openSettings: "Open Settings",
  },

  tooltip: {
    title: "📸 Tip",
    message: "You can also upload photos from your device gallery by tapping the image icon.",
    button: "Got it!",
  },
};

// 🎨 Preview Screen
export const PreviewCopy = {
  title: "Preview",
  retakeButton: "Retake",
  generateButton: "Transform with AI ✨",

  processing: {
    button: "Processing...",
    messages: [
      "AI is working its magic... 🪄",
      "Removing that background... ✨",
      "Making it Amazon-ready... 🎨",
      "Polishing your product... 💎",
      "Creating the perfect shot... 📸",
      "Transforming your image... ⚡",
      "Almost there... 🚀",
      "Perfecting every pixel... 🎯",
      "Creating something amazing... 💫",
      "Making your product shine... ✨",
    ],
  },

  errors: {
    timeout: "Request timed out. Please try again.",
    network: "Unable to connect to server. Please check your connection and try again.",
    failed: (message: string) => message,
  },
};

// 🎊 Result Screen
export const ResultCopy = {
  title: "Your Result",
  doneButton: "Done",
  specs: "✨ 2000 x 2000 - JPG - White Background",

  save: {
    button: "Save This Masterpiece 💾",
    saving: "Saving...",
    saved: "Saved to Gallery ✓",
  },

  generate: {
    button: "Generate Another",
  },

  success: {
    title: "Boom! 🎉",
    message: "Your perfect Amazon photo is in your gallery! You're crushing it! 🔥",
    alert: {
      title: "Success! 🎉",
      message: "Your perfect Amazon photo is ready! Keep crushing it! 🔥",
    },
  },

  errors: {
    permissionTitle: "Permission Required",
    permissionMessage: "Please enable gallery access in your device settings to save photos.",
    permissionButtons: {
      cancel: "Cancel",
      settings: "Open Settings",
    },
    saveFailed: {
      title: "Save Failed",
      message: "Could not save the image to your gallery. Please try again.",
    },
  },
};

// 🖼️ Batch Selection Screen
export const BatchSelectionCopy = {
  title: (count: number) => {
    if (count === 0) return "No images selected";
    if (count === 1) return "1 photo loaded! 🎨";
    if (count >= 10) return `${count} photos loaded! (max) 🔥`;
    return `${count} photos loaded! 🎨`;
  },
  subtitle: "Review your selection before processing",
  addMore: "Add More",
  cancelButton: "Cancel",
  processButton: "Transform All ✨",

  swipe: {
    delete: "🗑️",
  },
};

// 🚀 Batch Queue Screen
export const BatchQueueCopy = {
  title: "Transformation Station 🎨",
  currentlyProcessing: "Currently Processing",
  processingText: "Processing...",
  processedImages: (current: number, total: number) =>
    `Processed Images (${current}/${total})`,
  emptyState: "No images processed yet",

  controls: {
    pause: "Pause",
    resume: "Resume",
    cancel: "Cancel",
    saveAll: "Save All",
    saving: "Saving...",
    allSaved: "All Saved ✓",
    done: "Done",
  },

  completion: {
    title: "Mission Complete! 🎉",
    allSuccess: (count: number) => `Boom! All ${count} images are ready! You're on fire! 🔥🎉`,
    withFailures: (success: number, failed: number) =>
      `Crushing it! ${success} images ready, ${failed} had issues.`,
  },

  save: {
    single: {
      title: "Saved! 💾",
      message: "Your Amazon-ready image is in your gallery!",
    },
    all: {
      title: "Mission Accomplished! 💾",
      allSuccess: (count: number) => `All ${count} images saved! You're crushing it! 🎉🔥`,
      withFailures: (success: number, total: number) =>
        `Saved ${success} of ${total} images. Not bad! 💪`,
      alreadySaved: {
        title: "Already Saved",
        message: "All images have already been saved.",
      },
    },
    failed: {
      title: "Save Failed",
      message: "Could not save images to your gallery. Please try again.",
    },
  },

  retry: {
    success: {
      title: "Success",
      message: "Image processed successfully!",
    },
    failed: {
      title: "Retry Failed",
      message: (error?: string) => error || "Failed to process image. Please try again.",
    },
  },

  cancel: {
    title: "Cancel Processing",
    message: "Are you sure you want to cancel? Completed images will be saved.",
    buttons: {
      continue: "Continue Processing",
      cancel: "Cancel",
    },
  },
};

// 🎯 Milestone Messages
export const MilestoneCopy = {
  5: {
    title: "On a Roll! 🔥",
    message: "5 images down! You're getting good at this!",
  },
  10: {
    title: "Double Digits! 🏆",
    message: "10 images! You're a pro now!",
  },
  25: {
    title: "Quarter Century! 💎",
    message: "25 images! You're unstoppable!",
  },
  50: {
    title: "Half Century! 🚀",
    message: "50 images! You're absolutely crushing it!",
  },
  100: {
    title: "LEGENDARY! 👑",
    message: "100 images! You're a true master!",
  },
};

// 🎊 Random Encouragement (for use anywhere)
export const EncouragementCopy = {
  generic: [
    "You're crushing it! 🔥",
    "Keep going! 💪",
    "You're on fire! 🚀",
    "Amazing work! ✨",
    "You're a pro! 🏆",
    "Unstoppable! 💎",
    "Killing it! 🎯",
    "On a roll! 🔥",
  ],

  random: () => {
    const messages = EncouragementCopy.generic;
    return messages[Math.floor(Math.random() * messages.length)];
  },
};

// 🎨 Helper Functions
export const CopyHelpers = {
  /**
   * Get a random processing message
   */
  randomProcessingMessage: () => {
    const messages = PreviewCopy.processing.messages;
    return messages[Math.floor(Math.random() * messages.length)];
  },

  /**
   * Get milestone message for a count
   */
  getMilestone: (count: number) => {
    const milestones = [5, 10, 25, 50, 100];
    const milestone = milestones.find(m => m === count);
    return milestone ? MilestoneCopy[milestone as keyof typeof MilestoneCopy] : null;
  },

  /**
   * Format count with personality
   */
  formatCount: (count: number, singular: string, plural: string) => {
    if (count === 0) return `No ${plural}`;
    if (count === 1) return `1 ${singular}`;
    return `${count} ${plural}`;
  },
};
