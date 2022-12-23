import { channels } from '../_data';

export type ChannelT = keyof typeof channels;

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke(channel: ChannelT, args: unknown[]): Promise<any>;
        removeAllListeners(channel: ChannelT): void;
      };
    };
  }
}

export {};
