import fs from 'fs';
import { IpcMainEvent } from 'electron';
import { channels } from '../renderer/_data';

export function getSubfolders(
  event: IpcMainEvent,
  { directory }: { directory: string }
): void {
  try {
    const contents = fs
      .readdirSync(directory)
      .map((content) => `${directory}/${content}`);

    event.reply(channels.GET_SUB_FOLDERS, { contents });
  } catch (error) {
    event.reply(channels.GET_SUB_FOLDERS, {
      error,
      directory
    });
  }
}

export function getImages(
  event: IpcMainEvent,
  { directory }: { directory: string }
): void {
  try {
    const contents = fs
      .readdirSync(directory)
      .map((content) => `${directory}/${content}`);

    event.reply(channels.GET_IMAGES, {
      contents,
      directory
    });
  } catch (error) {
    event.reply(channels.GET_IMAGES, {
      error,
      directory
    });
  }
}

export function deleteImage(
  event: IpcMainEvent,
  {
    directory,
    filename
  }: {
    directory: string;
    filename: string;
  }
): void {
  try {
    const file = `${directory}/${filename}`;
    const isDir = fs.lstatSync(file).isDirectory();

    if (isDir) {
      fs.rmSync(file, {
        recursive: true,
        force: true
      });
    } else {
      fs.unlinkSync(file);
    }

    event.reply(channels.DELETE_IMAGE, {
      success: true
    });
  } catch (error) {
    event.reply(channels.DELETE_IMAGE, {
      success: false,
      error
    });
  }
}
