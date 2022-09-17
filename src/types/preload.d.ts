type Channels = 'GET_ALL_IMAGES' | 'GET_IMAGE' | 'DELETE_IMAGE';

type Args = {
  directory: string;
  filename?: string;
};

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: Args): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};
