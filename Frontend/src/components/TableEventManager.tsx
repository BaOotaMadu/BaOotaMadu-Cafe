type EventHandler = (data?: any) => void;

class TableEventManager {
  private events: { [key: string]: EventHandler[] } = {};

  subscribe(event: string, handler: EventHandler) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  }

  unsubscribe(event: string, handler: EventHandler) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((h) => h !== handler);
  }

  publish(event: string, data?: any) {
    if (!this.events[event]) return;
    this.events[event].forEach((handler) => handler(data));
  }
}

const tableEventManager = new TableEventManager();
export default tableEventManager;
