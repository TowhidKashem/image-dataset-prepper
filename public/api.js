const fs = require('fs');
const { ipcMain } = require('electron');

const GET_FOLDER_CONTENTS = 'GET_FOLDER_CONTENTS';
const GET_IMAGE = 'GET_IMAGE';
const DELETE_IMAGE = 'DELETE_IMAGE';

function getFolderContents(event, args) {
  try {
    event.reply(GET_FOLDER_CONTENTS, {
      contents: fs.readdirSync(args.directory),
      args
    });
  } catch (error) {
    event.reply(GET_FOLDER_CONTENTS, {
      error,
      directory: args.directory
    });
  }
}

function getImage(event, args) {
  try {
    const file = args.directory + '/' + args.filename;
    const image = fs.readFileSync(file);

    event.reply(GET_IMAGE, image.toString('base64'));
  } catch (error) {
    event.reply(GET_IMAGE, error);
  }
}

function deleteImage(event, args) {
  try {
    const file = args.directory + '/' + args.filename;
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

// routes
ipcMain.on(GET_FOLDER_CONTENTS, getFolderContents);
ipcMain.on(GET_IMAGE, getImage);
ipcMain.on(DELETE_IMAGE, deleteImage);
