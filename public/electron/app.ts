const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, '../logo192.png'),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.ts')
    }
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    win.webContents.openDevTools({ mode: 'right' });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
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
