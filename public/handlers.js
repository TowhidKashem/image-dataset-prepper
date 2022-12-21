const fs = require('fs');
const { GET_FOLDER_CONTENTS, GET_IMAGE, DELETE_IMAGE } = require('./_data');

function getFolderContents(event, args) {
  const { directory } = args;

  try {
    const contents = fs
      .readdirSync(directory)
      .map((content) => `${directory}/${content}`);

    event.reply(GET_FOLDER_CONTENTS, {
      contents,
      args
    });
  } catch (error) {
    event.reply(GET_FOLDER_CONTENTS, {
      error,
      directory
    });
  }
}

function getImage(event, args) {
  try {
    const file = `${args.directory}/${args.filename}`;
    const image = fs.readFileSync(file);

    event.reply(GET_IMAGE, image.toString('base64'));
  } catch (error) {
    event.reply(GET_IMAGE, error);
  }
}

function deleteImage(event, args) {
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

    event.reply(DELETE_IMAGE, { success: true });
  } catch (error) {
    event.reply(DELETE_IMAGE, {
      success: false,
      error
    });
  }
}

module.exports = {
  getFolderContents,
  getImage,
  deleteImage
};
