const fs = require('fs');
const path = require('path');
const url = require('url');
const { app, BrowserWindow, ipcMain } = require('electron');

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.ts')
    }
  });

  //  `file://${__dirname}/../build/index.html`

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist', 'mac', 'index.html'),
        protocol: 'file',
        slashes: true
      })
    );
  }

  // if (isDev) {
  mainWindow.webContents.openDevTools({ mode: 'right' });
  // }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});

//*--------------------------------------- endpoints ---------------------------------------*//

const GET_ALL_IMAGES = 'GET_ALL_IMAGES';
const GET_IMAGE = 'GET_IMAGE';
const DELETE_IMAGE = 'DELETE_IMAGE';

ipcMain.on(GET_ALL_IMAGES, async (event, args) => {
  try {
    const images = fs.readdirSync(args.directory);
    event.reply(GET_ALL_IMAGES, images);
  } catch (error) {
    event.reply(GET_ALL_IMAGES, {
      error,
      directory: args.directory
    });
  }
});

ipcMain.on(GET_IMAGE, async (event, args) => {
  try {
    const file = args.directory + '/' + args.filename;
    const image = fs.readFileSync(file);

    event.reply(GET_IMAGE, image.toString('base64'));
  } catch (error) {
    event.reply(GET_IMAGE, error);
  }
});

ipcMain.on(DELETE_IMAGE, async (event, args) => {
  try {
    const file = args.directory + '/' + args.filename;
    fs.unlinkSync(file);

    event.reply(DELETE_IMAGE, { success: true });
  } catch (error) {
    event.reply(DELETE_IMAGE, {
      success: false,
      error
    });
  }
});
