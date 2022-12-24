import fs from 'fs';
import path from 'path';
import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { channels, AppDataT } from '../renderer/_data';

const handleGetAppData = async (): Promise<ResponseT<AppDataT>> => ({
  data: {
    envVars: {
      PROJECT_ROOT: path.resolve(__dirname, '../../')
    }
  }
});

const handleListDirectory = async (
  _e: IpcMainInvokeEvent,
  path: string
): Promise<ResponseT<DirContentT[]>> => {
  const BLACKLIST = ['.DS_Store', '1'];

  try {
    const contents = fs
      .readdirSync(path)
      .filter((dirName) => !BLACKLIST.includes(dirName))
      .map((dirName) => {
        const filePath = `${path}/${dirName}`;

        return {
          name: dirName,
          path: filePath,
          isDir: fs.statSync(filePath).isDirectory()
        };
      });

    return {
      data: contents
    };
  } catch (error) {
    return {
      error: new Error(error as string)
    };
  }
};

const handleDeleteFile = async (
  _e: IpcMainInvokeEvent,
  path: string
): Promise<ResponseT<void>> => {
  try {
    const pathSegments = path.split('/');

    const fileToDelete = pathSegments.pop();

    const parentDir = pathSegments.join('/');

    const trashDir = `${parentDir}/trash.tmp`;

    if (!fs.existsSync(trashDir)) fs.mkdirSync(trashDir);

    fs.renameSync(path, `${trashDir}/${fileToDelete}`);
  } catch (error) {
    return {
      error: new Error(error as string)
    };
  }
};

const handleUndoDeleteFile = async (
  _e: IpcMainInvokeEvent,
  path: string
): Promise<ResponseT<void>> => {
  try {
    const pathSegments = path.split('/');

    const fileToDelete = pathSegments.pop();

    const parentDir = pathSegments.join('/');

    const trashDir = `${parentDir}/trash.tmp`;

    fs.renameSync(`${trashDir}/${fileToDelete}`, path);
  } catch (error) {
    return {
      error: new Error(error as string)
    };
  }
};

const handleEmptyTrash = async (
  _e: IpcMainInvokeEvent,
  path: string
): Promise<ResponseT<void>> => {
  try {
    fs.rmSync(`${path}/trash.tmp`, {
      recursive: true,
      force: true
    });
  } catch (error) {
    return {
      error: new Error(error as string)
    };
  }
};

// endpoints
ipcMain.handle(channels.GET_APP_DATA, handleGetAppData);
ipcMain.handle(channels.LIST_DIR, handleListDirectory);
ipcMain.handle(channels.DELETE_FILE, handleDeleteFile);
ipcMain.handle(channels.UNDO_DELETE, handleUndoDeleteFile);
ipcMain.handle(channels.EMPTY_TRASH, handleEmptyTrash);
