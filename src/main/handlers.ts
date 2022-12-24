import fs from 'fs';
import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { channels } from '../renderer/_data';

const handleListDirectory = async (
  e: IpcMainInvokeEvent,
  path: string
): Promise<Res<string[]>> => {
  try {
    const contents = fs
      .readdirSync(path)
      .map((dirName) => `${path}/${dirName}`);

    return {
      data: contents,
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: new Error(error as string)
    };
  }
};

ipcMain.handle(channels.LIST_DIR, handleListDirectory);

const handleDeleteImage = async (
  e: IpcMainInvokeEvent,
  args: {
    directory: string;
    filename: string;
  }
): Promise<void | unknown> => {
  try {
    const file = `${args.directory}/${args.filename}`;

    fs.unlinkSync(file);
  } catch (error) {
    return error;
  }
};

ipcMain.handle(channels.DELETE_IMAGE, handleDeleteImage);
