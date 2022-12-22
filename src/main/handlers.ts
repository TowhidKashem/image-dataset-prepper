import fs from 'fs';
import { channels } from '../renderer/_data';
import { ChannelT } from '../renderer/_types';

export function getSubfolders(
  event: ChannelT,
  { directory }: { directory: string }
) {
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

export function getImages(event, args) {
  const { directory } = args;

  try {
    const contents = fs
      .readdirSync(directory)
      .map((content) => `${directory}/${content}`);

    event.reply(channels.GET_IMAGES, {
      contents,
      args
    });
  } catch (error) {
    event.reply(channels.GET_IMAGES, {
      error,
      directory
    });
  }
}

export function deleteImage(event, args) {
  try {
    const file = `${args.directory}/${args.filename}`;
    const isDir = fs.lstatSync(file).isDirectory();

    if (isDir) {
      fs.rmSync(file, {
        recursive: true,
        force: true
      });
    } else {
      fs.unlinkSync(file);
    }

    event.reply(channels.DELETE_IMAGE, { success: true });
  } catch (error) {
    event.reply(channels.DELETE_IMAGE, {
      success: false,
      error
    });
  }
}
