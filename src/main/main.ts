import path from 'path';
import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './_utils';

let mainWindow: BrowserWindow | null = null;

require('./handlers');

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

export const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) require('electron-debug')({ showDevTools: false });

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  try {
    return installer.default(
      extensions.map((name) => installer[name]),
      forceDownload
    );
  } catch (error) {
    console.error(error);
  }
};

const createWindow = async (): Promise<void> => {
  if (isDebug) await installExtensions();

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string =>
    path.join(RESOURCES_PATH, ...paths);

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js')
    }
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow
    .on('ready-to-show', () => {
      if (!mainWindow) throw new Error('`mainWindow` is not defined');
      if (process.env.START_MINIMIZED) return mainWindow.minimize();

      mainWindow.show();
    })
    .on('closed', () => {
      mainWindow = null;
    });

  new MenuBuilder(mainWindow).buildMenu();
};

app
  // respect the osx convention of having the application in memory
  // even after all windows have been closed
  .on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  })
  // restrict navigation to known domains for better security
  .on('web-contents-created', (_, contents) => {
    contents.on('will-navigate', (e, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);
      const NAV_ALLOW_LIST = ['https://image-reviewer.com'];

      if (!NAV_ALLOW_LIST.includes(parsedUrl.origin)) e.preventDefault();
    });
  });

const onAppReady = async (): Promise<void> => {
  try {
    await app.whenReady();

    createWindow();

    // on mac its common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });

    // custom protocol to display local images without disabling web security
    protocol.registerFileProtocol('img', (request, callback) => {
      const url = request.url.replace('img://', '');

      try {
        return callback(url);
      } catch (error) {
        console.error(error);
        return callback({ error: 404 });
      }
    });

    // open directory picker dialog
    ipcMain.on('open-picker-dialog', async () => {
      try {
        const result = await dialog.showOpenDialog(mainWindow, {
          properties: ['openDirectory']
        });

        mainWindow.webContents.send('dialog-picker-result', result);
      } catch (error) {
        console.error(error);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

onAppReady();
