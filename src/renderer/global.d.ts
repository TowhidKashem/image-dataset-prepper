import { channels } from './_data';

export type ChannelT = keyof typeof channels;

declare global {
  interface Res<T> {
    data?: T;
    error?: Error;
  }

  interface Window {
    electron: {
      ipcRenderer: {
        invoke<T>(channel: ChannelT, args: unknown): Promise<T>;
        removeAllListeners(channel: ChannelT): void;
      };
    };
  }
}

export {};
