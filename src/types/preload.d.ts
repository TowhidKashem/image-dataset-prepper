declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(
          channel: 'GET_FOLDER_CONTENTS' | 'GET_IMAGE' | 'DELETE_IMAGE',
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
