import { TopicT } from '../_data';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(
          channel: TopicT,
          args: {
            directory: string;
            root?: boolean;
            filename?: string;
          }
        ): void;
        on(
          channel: string,
          func: (...args: any) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: any) => void): void;
      };
    };
  }
}

export {};
