// signalRService.js
import { HubConnectionBuilder, LogLevel , HttpTransportType } from '@microsoft/signalr';
import { ref, reactive } from 'vue';
import Cookies from 'js-cookie';

class SignalRService {
  constructor() {
    this.connection = null;
    this.isConnected = ref(false);
    this.connectionState = ref('Disconnected');
    this.registeredEvents = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000; // 5 seconds
  }

  /**
   * Initialize and start the SignalR connection
   * @param {string} hubUrl - The URL of the SignalR hub
   * @param {Object} options - Connection options
   */
  async connect(hubUrl = import.meta.env.VITE_BASE_SESSION_URL, options = {}) {
    try {
      if (this.connection && this.connection.state === 'Connected') {
        console.log('SignalR connection already established');
        return;
      }

      // Set default options for connection
      const defaultOptions = {
        skipNegotiation: false,
        transport: HttpTransportType.WebSockets,
        logLevel: LogLevel.Information,
        withCredentials: true,
        ...options
      };

      // Build the connection
      const builder = new HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => Cookies.get('access_token'),
          skipNegotiation: defaultOptions.skipNegotiation,
          transport: defaultOptions.transport,
          withCredentials: defaultOptions.withCredentials,
          ...defaultOptions.connectionOptions
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount < this.maxReconnectAttempts) {
              return this.reconnectInterval;
            }
            return null; // Stop reconnecting
          }
        });

      // Set log level
      builder.configureLogging(defaultOptions.logLevel);

      this.connection = builder.build();

      // Set up connection event handlers
      this.setupConnectionEvents();

      // Re-register existing events after connection is built
      this.reRegisterEvents();

      // Start the connection
      await this.connection.start();
      
      this.isConnected.value = true;
      this.connectionState.value = this.connection.state;
      this.reconnectAttempts = 0;
      
      console.log('SignalR connection established successfully');
      
    } catch (error) {
      console.error('Failed to start SignalR connection:', error);
      this.isConnected.value = false;
      this.connectionState.value = 'Disconnected';
      throw error;
    }
  }

  /**
   * Disconnect from the SignalR hub
   */
  async disconnect() {
    try {
      if (this.connection) {
        await this.connection.stop();
        this.isConnected.value = false;
        this.connectionState.value = 'Disconnected';
        console.log('SignalR connection disconnected');
      }
    } catch (error) {
      console.error('Error disconnecting SignalR:', error);
      throw error;
    }
  }

  /**
   * Register an event handler
   * @param {string} eventName - The name of the event to listen for
   * @param {Function} handler - The callback function to execute
   */
  on(eventName, handler) {
    if (!eventName || typeof handler !== 'function') {
      throw new Error('Event name and handler function are required');
    }

    // Store the event for re-registration after reconnection
    if (!this.registeredEvents.has(eventName)) {
      this.registeredEvents.set(eventName, []);
    }
    this.registeredEvents.get(eventName).push(handler);

    // Register with SignalR connection if available
    if (this.connection) {
      this.connection.on(eventName, handler);
    }

    console.log(`Event '${eventName}' registered`);
  }

  /**
   * Unregister an event handler
   * @param {string} eventName - The name of the event
   * @param {Function} handler - The specific handler to remove (optional)
   */
  off(eventName, handler = null) {
    if (this.connection) {
      if (handler) {
        this.connection.off(eventName, handler);
      } else {
        this.connection.off(eventName);
      }
    }

    // Remove from stored events
    if (this.registeredEvents.has(eventName)) {
      if (handler) {
        const handlers = this.registeredEvents.get(eventName);
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
        if (handlers.length === 0) {
          this.registeredEvents.delete(eventName);
        }
      } else {
        this.registeredEvents.delete(eventName);
      }
    }

    console.log(`Event '${eventName}' unregistered`);
  }

  /**
   * Invoke a method on the SignalR hub
   * @param {string} methodName - The name of the method to invoke
   * @param {...any} args - Arguments to pass to the method
   */
  async invoke(methodName, ...args) {
    try {
      if (!this.connection || this.connection.state !== 'Connected') {
        throw new Error('SignalR connection is not established');
      }

      const result = await this.connection.invoke(methodName, ...args);
      console.log(`Method '${methodName}' invoked successfully`);
      return result;
    } catch (error) {
      console.error(`Error invoking method '${methodName}':`, error);
      throw error;
    }
  }

  /**
   * Send a message to the hub without waiting for a response
   * @param {string} methodName - The name of the method to send
   * @param {...any} args - Arguments to pass to the method
   */
  async send(methodName, ...args) {
    try {
      if (!this.connection || this.connection.state !== 'Connected') {
        throw new Error('SignalR connection is not established');
      }

      await this.connection.send(methodName, ...args);
      console.log(`Message '${methodName}' sent successfully`);
    } catch (error) {
      console.error(`Error sending message '${methodName}':`, error);
      throw error;
    }
  }

  /**
   * Get the current connection state
   */
  getConnectionState() {
    return this.connection ? this.connection.state : 'Disconnected';
  }

  /**
   * Check if connection is active
   */
  get connected() {
    return this.isConnected.value;
  }

  /**
   * Get connection ID
   */
  getConnectionId() {
    return this.connection ? this.connection.connectionId : null;
  }

  /**
   * Setup connection event handlers
   */
  setupConnectionEvents() {
    if (!this.connection) return;

    this.connection.onclose((error) => {
      this.isConnected.value = false;
      this.connectionState.value = 'Disconnected';
      console.log('SignalR connection closed', error);
    });

    this.connection.onreconnecting((error) => {
      this.isConnected.value = false;
      this.connectionState.value = 'Reconnecting';
      console.log('SignalR connection reconnecting', error);
    });

    this.connection.onreconnected((connectionId) => {
      this.isConnected.value = true;
      this.connectionState.value = 'Connected';
      this.reconnectAttempts = 0;
      console.log('SignalR connection reconnected', connectionId);
    });
  }

  /**
   * Re-register all stored events (used after reconnection)
   */
  reRegisterEvents() {
    if (!this.connection) return;

    for (const [eventName, handlers] of this.registeredEvents) {
      handlers.forEach(handler => {
        this.connection.on(eventName, handler);
      });
    }
  }

  /**
   * Clear all registered events
   */
  clearAllEvents() {
    if (this.connection) {
      for (const eventName of this.registeredEvents.keys()) {
        this.connection.off(eventName);
      }
    }
    this.registeredEvents.clear();
  }
}

// Create a singleton instance
const signalRService = new SignalRService();

// Vue 3 plugin
export const SignalRPlugin = {
  install(app, options = {}) {
    // Make the service available globally
    app.config.globalProperties.$signalR = signalRService;
    app.provide('signalR', signalRService);
  }
};

export default signalRService;

// Composable for Vue 3 Composition API
export function useSignalR() {
  return {
    signalR: signalRService,
    isConnected: signalRService.isConnected,
    connectionState: signalRService.connectionState,
    
    // Convenience methods
    connect: signalRService.connect.bind(signalRService),
    disconnect: signalRService.disconnect.bind(signalRService),
    on: signalRService.on.bind(signalRService),
    off: signalRService.off.bind(signalRService),
    invoke: signalRService.invoke.bind(signalRService),
    send: signalRService.send.bind(signalRService),
  };
}