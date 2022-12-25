import { channels } from './_data';

export type ChannelT = keyof typeof channels;

declare global {
  interface ResponseT<T> {
    data?: T;
    error: Error;
  }

  interface DirContentT {
    name: string;
    path: string;
    extension: string;
    isDir: boolean;
  }

  interface Window {
    electron: {
      ipcRenderer: {
        invoke<T>(channel: ChannelT, args: unknown): Promise<T>;
        removeAllListeners(channel: ChannelT): void;
      };
    };
    showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>;
  }
}

export {};
