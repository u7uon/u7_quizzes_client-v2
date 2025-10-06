// noti.js - Unified Notification System
class NotificationManager {
  constructor() {
    this.container = null;
    this.notifications = [];
    this.init();
  }

  init() {
    // Create notification container
    this.container = document.createElement('div');
    this.container.id = 'notification-container';
    this.container.className = 'notification-container';
    document.body.appendChild(this.container);

    // Add styles
    this.addStyles();
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        pointer-events: none;
        max-width: 400px;
      }

      .notification {
        background: white;
        border-radius: 12px;
        padding: 16px 20px;
        margin-bottom: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        border-left: 4px solid;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        pointer-events: auto;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        position: relative;
        overflow: hidden;
      }

      .notification.show {
        transform: translateX(0);
        opacity: 1;
      }

      .notification.hide {
        transform: translateX(100%);
        opacity: 0;
        margin-bottom: 0;
        padding-top: 0;
        padding-bottom: 0;
        max-height: 0;
      }

      .notification::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: currentColor;
        opacity: 0.3;
      }

      .notification.success {
        border-left-color: #22c55e;
        background: linear-gradient(135deg, #f0fdf4, #dcfce7);
        color: #15803d;
      }

      .notification.error {
        border-left-color: #ef4444;
        background: linear-gradient(135deg, #fef2f2, #fee2e2);
        color: #dc2626;
      }

      .notification.warning {
        border-left-color: #f59e0b;
        background: linear-gradient(135deg, #fffbeb, #fef3c7);
        color: #d97706;
      }

      .notification.info {
        border-left-color: #3b82f6;
        background: linear-gradient(135deg, #eff6ff, #dbeafe);
        color: #2563eb;
      }

      .notification-icon {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 14px;
        font-weight: 600;
      }

      .notification.success .notification-icon {
        background: rgba(34, 197, 94, 0.2);
        color: #15803d;
      }

      .notification.error .notification-icon {
        background: rgba(239, 68, 68, 0.2);
        color: #dc2626;
      }

      .notification.warning .notification-icon {
        background: rgba(245, 158, 11, 0.2);
        color: #d97706;
      }

      .notification.info .notification-icon {
        background: rgba(59, 130, 246, 0.2);
        color: #2563eb;
      }

      .notification-content {
        flex: 1;
        min-width: 0;
      }

      .notification-title {
        font-weight: 700;
        font-size: 14px;
        margin: 0 0 4px 0;
        line-height: 1.3;
      }

      .notification-message {
        font-size: 13px;
        line-height: 1.4;
        opacity: 0.9;
        margin: 0;
      }

      .notification-close {
        flex-shrink: 0;
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        border-radius: 6px;
        color: currentColor;
        opacity: 0.6;
        transition: all 0.2s ease;
        font-size: 16px;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .notification-close:hover {
        opacity: 1;
        background: rgba(0, 0, 0, 0.1);
      }

      .notification-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        background: currentColor;
        opacity: 0.4;
        transition: width linear;
      }

      @media (max-width: 480px) {
        .notification-container {
          left: 16px;
          right: 16px;
          top: 16px;
          max-width: none;
        }

        .notification {
          margin-bottom: 8px;
          padding: 12px 16px;
        }
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .notification {
          background: rgba(30, 41, 59, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .notification.success {
          background: linear-gradient(135deg, rgba(5, 46, 22, 0.9), rgba(6, 78, 59, 0.8));
          color: #86efac;
        }

        .notification.error {
          background: linear-gradient(135deg, rgba(69, 10, 10, 0.9), rgba(127, 29, 29, 0.8));
          color: #fca5a5;
        }

        .notification.warning {
          background: linear-gradient(135deg, rgba(69, 26, 3, 0.9), rgba(120, 53, 15, 0.8));
          color: #fcd34d;
        }

        .notification.info {
          background: linear-gradient(135deg, rgba(7, 89, 133, 0.9), rgba(29, 78, 216, 0.8));
          color: #93c5fd;
        }
      }
    `;
    document.head.appendChild(style);
  }

  show(options) {
    const notification = this.createNotification(options);
    this.container.appendChild(notification);
    this.notifications.push(notification);

    // Trigger animation
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });

    // Auto remove
    if (options.duration !== 0) {
      const duration = options.duration || 5000;
      this.setupAutoRemove(notification, duration);
    }

    return notification;
  }

  createNotification(options) {
    const {
      type = 'info',
      title,
      message,
      closable = true,
      duration = 5000
    } = options;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    notification.innerHTML = `
      <div class="notification-icon">${icons[type]}</div>
      <div class="notification-content">
        ${title ? `<div class="notification-title">${title}</div>` : ''}
        <div class="notification-message">${message}</div>
      </div>
      ${closable ? '<button class="notification-close">×</button>' : ''}
      ${duration > 0 ? '<div class="notification-progress"></div>' : ''}
    `;

    // Close button handler
    if (closable) {
      const closeBtn = notification.querySelector('.notification-close');
      closeBtn.addEventListener('click', () => this.remove(notification));
    }

    return notification;
  }

  setupAutoRemove(notification, duration) {
    const progressBar = notification.querySelector('.notification-progress');
    
    if (progressBar) {
      progressBar.style.width = '100%';
      progressBar.style.transitionDuration = duration + 'ms';
      
      requestAnimationFrame(() => {
        progressBar.style.width = '0%';
      });
    }

    setTimeout(() => {
      this.remove(notification);
    }, duration);
  }

  remove(notification) {
    if (!notification.classList.contains('hide')) {
      notification.classList.add('hide');
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        this.notifications = this.notifications.filter(n => n !== notification);
      }, 300);
    }
  }

  // Convenience methods
  success(message, title = null, options = {}) {
    return this.show({ type: 'success', title, message, ...options });
  }

  error(message, title = null, options = {}) {
    return this.show({ type: 'error', title, message, ...options });
  }

  warning(message, title = null, options = {}) {
    return this.show({ type: 'warning', title, message, ...options });
  }

  info(message, title = null, options = {}) {
    return this.show({ type: 'info', title, message, ...options });
  }

  // Clear all notifications
  clear() {
    this.notifications.forEach(notification => {
      this.remove(notification);
    });
  }

  // Confirm dialog replacement
  confirm(options) {
    return new Promise((resolve) => {
      const {
        title = 'Xác nhận',
        message,
        confirmText = 'Xác nhận',
        cancelText = 'Hủy bỏ',
        type = 'warning'
      } = options;

      const overlay = document.createElement('div');
      overlay.className = 'notification-confirm-overlay';
      
      overlay.innerHTML = `
        <div class="notification-confirm-modal">
          <div class="notification-confirm-header ${type}">
            <div class="notification-confirm-icon">${type === 'warning' ? '⚠' : type === 'error' ? '✕' : 'ℹ'}</div>
            <h3 class="notification-confirm-title">${title}</h3>
          </div>
          <div class="notification-confirm-body">
            <p class="notification-confirm-message">${message}</p>
          </div>
          <div class="notification-confirm-actions">
            <button class="notification-confirm-cancel">${cancelText}</button>
            <button class="notification-confirm-ok ${type}">${confirmText}</button>
          </div>
        </div>
      `;

      // Add modal styles
      const style = document.createElement('style');
      style.textContent = `
        .notification-confirm-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10001;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .notification-confirm-modal {
          background: white;
          border-radius: 16px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          animation: slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .notification-confirm-header {
          padding: 20px;
          text-align: center;
          border-bottom: 1px solid #e5e7eb;
        }

        .notification-confirm-header.warning {
          background: linear-gradient(135deg, #fffbeb, #fef3c7);
          color: #d97706;
        }

        .notification-confirm-header.error {
          background: linear-gradient(135deg, #fef2f2, #fee2e2);
          color: #dc2626;
        }

        .notification-confirm-header.info {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          color: #2563eb;
        }

        .notification-confirm-icon {
          font-size: 2.5rem;
          margin-bottom: 8px;
        }

        .notification-confirm-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .notification-confirm-body {
          padding: 20px;
        }

        .notification-confirm-message {
          margin: 0;
          line-height: 1.6;
          color: #374151;
          text-align: center;
        }

        .notification-confirm-actions {
          padding: 20px;
          background: #f9fafb;
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .notification-confirm-cancel,
        .notification-confirm-ok {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 100px;
        }

        .notification-confirm-cancel {
          background: #f3f4f6;
          color: #374151;
          border: 2px solid #e5e7eb;
        }

        .notification-confirm-cancel:hover {
          background: #e5e7eb;
        }

        .notification-confirm-ok {
          background: #3b82f6;
          color: white;
        }

        .notification-confirm-ok.warning {
          background: #f59e0b;
        }

        .notification-confirm-ok.error {
          background: #ef4444;
        }

        .notification-confirm-ok:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
      `;

      document.head.appendChild(style);
      document.body.appendChild(overlay);

      const handleResult = (result) => {
        document.body.removeChild(overlay);
        document.head.removeChild(style);
        resolve(result);
      };

      overlay.querySelector('.notification-confirm-cancel').addEventListener('click', () => handleResult(false));
      overlay.querySelector('.notification-confirm-ok').addEventListener('click', () => handleResult(true));
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) handleResult(false);
      });
    });
  }
}

// Create global instance
const noti = new NotificationManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = noti;
}

// Make available globally
window.noti = noti;