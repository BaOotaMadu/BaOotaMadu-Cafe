
interface TableEventData {
  [key: string]: any;
}

interface TableEventListener {
  (data: TableEventData): void;
}

interface TableEventManager {
  publish(eventType: string, data: TableEventData): void;
  subscribe(eventType: string, listener: TableEventListener): () => void;
}

// Global event manager for table events
class EventManager implements TableEventManager {
  private listeners: Record<string, TableEventListener[]> = {};

  publish(eventType: string, data: TableEventData): void {
    if (!this.listeners[eventType]) {
      return;
    }

    this.listeners[eventType].forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Error in event listener for ${eventType}:`, error);
      }
    });
  }

  subscribe(eventType: string, listener: TableEventListener): () => void {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }

    this.listeners[eventType].push(listener);

    // Return unsubscribe function
    return () => {
      this.listeners[eventType] = this.listeners[eventType].filter(l => l !== listener);
    };
  }
}

// Initialize and attach to window for global access
export const initTableEventManager = (): void => {
  if (!window.tableEventManager) {
    window.tableEventManager = new EventManager();
    console.log('Table event manager initialized');
  }
};

// Get table number from URL query param or default to a random one for demo
export const getTableNumber = (): string => {
  const params = new URLSearchParams(window.location.search);
  const tableParam = params.get('table');
  
  if (tableParam) {
    return tableParam;
  }
  
  // For demo, generate random table number between 1-20
  return Math.floor(Math.random() * 20) + 1 + '';
};

// Notify staff (simulated)
export const callStaff = async (tableNumber: string, reason?: string): Promise<void> => {
  console.log(`Table ${tableNumber} is calling staff${reason ? ` for ${reason}` : ''}`);
  
  // In a real app, this would send a notification to the staff interface
  if (window.tableEventManager) {
    window.tableEventManager.publish('callStaff', {
      tableNumber,
      reason,
      timestamp: new Date().toISOString()
    });
  }
  
  return Promise.resolve();
};

// Augment window object
declare global {
  interface Window {
    tableEventManager: TableEventManager;
  }
}
