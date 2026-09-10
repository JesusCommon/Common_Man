import type { NotificacionResponse } from '@/api/types';

type MessageHandler<T = unknown> = (data: T) => void;

interface WebSocketConfig {
  onNotification?: MessageHandler<NotificacionResponse>;
  onSaldoActualizado?: MessageHandler<{ saldo: number }>;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

interface WebSocketMessage {
  type: 'NEW_NOTIFICATION' | 'SALDO_ACTUALIZADO' | string;
  data: NotificacionResponse | { saldo: number } | unknown;
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxAttempts = 5;
  private reconnectDelay = 1000;
  private handlers: WebSocketConfig = {};
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private intentionalClose = false;

  private buildWebSocketUrl(token: string): string {
    const apiEnv = import.meta.env.VITE_API_URL;
    let baseUrl: string;

    if (apiEnv) {
      baseUrl = apiEnv
        .replace(/^http:/, 'ws:')
        .replace(/^https:/, 'wss:')
        .replace(/\/$/, '');
      
      if (import.meta.env.DEV) {
        baseUrl = baseUrl.replace('localhost', '127.0.0.1');
      }
    } else {
      baseUrl = 'ws://127.0.0.1:8000';
    }

    return `${baseUrl}/notificaciones/ws?token=${token}`;
  }

  connect(token: string, config: WebSocketConfig = {}): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.handlers = config;
    this.intentionalClose = false;

    const wsUrl = this.buildWebSocketUrl(token);

    try {
      this.ws = new WebSocket(wsUrl);
    } catch {
      return;
    }

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.startPing();
      config.onConnect?.();
    };

    this.ws.onmessage = (event: MessageEvent) => {
      if (typeof event.data === 'string' && event.data === 'pong') return;
      
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch {
        // Silenciar errores de parseo
      }
    };

    this.ws.onclose = (event) => {
      this.stopPing();
      config.onDisconnect?.();
      if (this.intentionalClose || event.code === 1000) return;
      this.reconnect(token);
    };

    this.ws.onerror = () => {
      // Silenciar errores de conexión
    };
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'NEW_NOTIFICATION':
        this.handlers.onNotification?.(message.data as NotificacionResponse);
        break;
      case 'SALDO_ACTUALIZADO':
        this.handlers.onSaldoActualizado?.(message.data as { saldo: number });
        break;
    }
  }

  private reconnect(token: string): void {
    if (this.reconnectAttempts >= this.maxAttempts) return;

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    setTimeout(() => {
      this.connect(token, this.handlers);
    }, delay);
  }

  private startPing(): void {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send('ping');
      }
    }, 30000);
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  disconnect(): void {
    this.intentionalClose = true;
    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close(1000, 'Desconexión manual');
      }
      this.ws = null;
    }
    this.stopPing();
    this.reconnectAttempts = 0;
  }
}

export const wsManager = new WebSocketManager();