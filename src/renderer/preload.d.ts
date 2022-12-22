import { ChannelT } from './_types';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: ChannelT, args: Record<string, unknown>): void;
        on(
          channel: ChannelT,
          func: (args: Record<string, unknown>) => void
        ): (() => void) | undefined;
        once(
          channel: ChannelT,
          func: (args: Record<string, unknown>) => void
        ): void;
      };
    };
  }
}

export {};
