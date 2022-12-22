const fs = require('fs');
const { GET_SUB_FOLDERS, GET_IMAGES, DELETE_IMAGE } = require('./_data');

function getSubfolders(event, { directory }) {
  try {
    const contents = fs
      .readdirSync(directory)
      .map((content) => `${directory}/${content}`);

    event.reply(GET_SUB_FOLDERS, { contents });
  } catch (error) {
    event.reply(GET_SUB_FOLDERS, {
      error,
      directory,
    });
  }
}

function getImages(event, args) {
  const { directory } = args;

  try {
    const contents = fs
      .readdirSync(directory)
      .map((content) => `${directory}/${content}`);

    event.reply(GET_IMAGES, {
      contents,
      args,
    });
  } catch (error) {
    event.reply(GET_IMAGES, {
      error,
      directory,
    });
  }
}

function deleteImage(event, args) {
  try {
    const file = `${args.directory}/${args.filename}`;
    const isDir = fs.lstatSync(file).isDirectory();

    if (isDir) {
      fs.rmSync(file, {
        recursive: true,
        force: true,
      });
    } else {
      fs.unlinkSync(file);
    }

    event.reply(DELETE_IMAGE, { success: true });
  } catch (error) {
    event.reply(DELETE_IMAGE, {
      success: false,
      error,
    });
  }
}

module.exports = {
  getSubfolders,
  getImages,
  deleteImage,
};
