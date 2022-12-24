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
  filePath: string
): Promise<ResponseT<DirContentT[]>> => {
  const BLACKLIST = ['.DS_Store', '1'];

  try {
    const contents = fs
      .readdirSync(filePath)
      .filter(
        (dirName) => !BLACKLIST.includes(dirName) && !dirName.startsWith('.')
      )
      .map((dirName) => {
        const newFilePath = `${filePath}/${dirName}`;
        const isDir = fs.statSync(newFilePath).isDirectory();

        return {
          name: dirName,
          path: newFilePath,
          extension: !isDir ? path.extname(newFilePath) : null,
          isDir
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
  filePath: string
): Promise<ResponseT<void>> => {
  try {
    const pathSegments = filePath.split('/');

    const fileToDelete = pathSegments.pop();

    const parentDir = pathSegments.join('/');

    const trashDir = `${parentDir}/trash.tmp`;

    if (!fs.existsSync(trashDir)) fs.mkdirSync(trashDir);

    fs.renameSync(filePath, `${trashDir}/${fileToDelete}`);
  } catch (error) {
    return {
      error: new Error(error as string)
    };
  }
};

const handleUndoDeleteFile = async (
  _e: IpcMainInvokeEvent,
  filePath: string
): Promise<ResponseT<void>> => {
  try {
    const pathSegments = filePath.split('/');

    const fileToDelete = pathSegments.pop();

    const parentDir = pathSegments.join('/');

    const trashDir = `${parentDir}/trash.tmp`;

    fs.renameSync(`${trashDir}/${fileToDelete}`, filePath);
  } catch (error) {
    return {
      error: new Error(error as string)
    };
  }
};

const handleEmptyTrash = async (
  _e: IpcMainInvokeEvent,
  filePath: string
): Promise<ResponseT<void>> => {
  try {
    fs.rmSync(`${filePath}/trash.tmp`, {
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
