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
    app: {
      ipcRenderer: {
        invoke<T>(channel: ChannelT, args: unknown): Promise<T>;
      };
      openDialogPicker(): void;
      onDialogPickerResult(
        callback: (result: Electron.OpenDialogReturnValue) => void
      ): void;
    };
  }
}

export {};
