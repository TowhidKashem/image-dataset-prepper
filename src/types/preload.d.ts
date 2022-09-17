declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(
          channel: 'GET_ALL_IMAGES' | 'GET_IMAGE' | 'DELETE_IMAGE',
          args: {
            directory: string;
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
