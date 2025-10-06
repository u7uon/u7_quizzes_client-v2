import { toast } from 'vue3-toastify';
// CSS should be imported in main.js instead
import infoSound from "../assets/sounds/info.mp3"
import warningSound from "../assets/sounds/warning.mp3"

const infos = new Audio(infoSound)
const warnings = new Audio(warningSound)

const playSound = (sound) => {
  console.log("play ok")
  sound.currentTime = 0
  sound.play().catch(err => console.error('Error playing sound:', err))
}

// Default toast configuration
const defaultOptions = {
  position: 'top-right',
  timeout: 4000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
};

// Toast utility functions
export const useToast = () => {
  const success = (message, options = {}) => {
    toast.success(message, {
      ...defaultOptions,
      ...options,
      toastId: `success-${message}`
    });
  };

  const error = (message, options = {}) => {
    toast.error(message, {
      ...defaultOptions,
      ...options,
      toastId: `error-${message}`
    });
  };

  const warning = (message, options = {}) => {
    toast.warning(message, {
      ...defaultOptions,
      ...options,
      toastId: `warning-${message}`
    });
  };

  const info = (message, options = {}) => {
    toast.info(message, {
      ...defaultOptions,
      ...options,
      toastId: `info-${message}`
    });
  };

  const custom = (message, options = {}) => {
    toast(message, {
      ...defaultOptions,
      ...options,
      toastId: `custom-${message}`
    });
  };

  // Clear all toasts
  const clear = () => {
    toast.clearAll();
  };

  return {
    success,
    error,
    warning,
    info,
    custom,
    clear
  };
};

// Direct export for convenience
export const showToast = {
  success: (message, options = {}) => 
    toast.success(message, { 
      ...defaultOptions, 
      ...options,
      toastId: `success-${message}`
    }),
  error: (message, options = {}) => 
    toast.error(message, { 
      ...defaultOptions, 
      ...options,
      toastId: `error-${message}`
    }),
  warning: (message, options = {}) => {
    toast.warning(message, { 
      ...defaultOptions, 
      ...options,
      toastId: `warning-${message}`
    })
    playSound(warnings)
  },
  info: (message, options = {}) => {   
    toast.info(message, { 
      ...defaultOptions, 
      ...options,
      toastId: `info-${message}`
    })                                 
    playSound(infos)
  },
  custom: (message, options = {}) => 
    toast(message, { 
      ...defaultOptions, 
      ...options,
      toastId: `custom-${message}`
    }),
  clear: () => toast.clearAll()
};

// Plugin installation function
export default {
  install(app, options = {}) {
    // Merge user options with defaults
    const finalOptions = { ...defaultOptions, ...options };
    
    // Make toast available globally
    app.config.globalProperties.$toast = {
      success: (message, opts = {}) => 
        toast.success(message, { 
          ...finalOptions, 
          ...opts,
          toastId: `success-${message}`
        }),
      error: (message, opts = {}) => 
        toast.error(message, { 
          ...finalOptions, 
          ...opts,
          toastId: `error-${message}`
        }),
      warning: (message, opts = {}) => 
        toast.warning(message, { 
          ...finalOptions, 
          ...opts,
          toastId: `warning-${message}`
        }),
      info: (message, opts = {}) => 
        toast.info(message, { 
          ...finalOptions, 
          ...opts,
          toastId: `info-${message}`
        }),
      custom: (message, opts = {}) => 
        toast(message, { 
          ...finalOptions, 
          ...opts,
          toastId: `custom-${message}`
        }),
      clear: () => toast.clearAll()
    };

    // Provide toast for composition API
    app.provide('toast', app.config.globalProperties.$toast);
  }
};