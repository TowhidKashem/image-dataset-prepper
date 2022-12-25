import path from 'path';
import { app, shell, BrowserWindow } from 'electron';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './_utils';

let mainWindow: BrowserWindow | null = null;

require('./handlers');

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) require('electron-debug')({ showDevTools: false });

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
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
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js')
    }
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) throw new Error('`mainWindow` is not defined');

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

// event listeners

// respect the osx convention of having the application in memory even after all windows have been closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// restrict navigation to known domains for better security
const NAV_ALLOW_LIST = ['https://image-reviewer.com'];
app.on('web-contents-created', (_, contents) => {
  contents.on('will-navigate', (e, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (!NAV_ALLOW_LIST.includes(parsedUrl.origin)) {
      e.preventDefault();
    }
  });
});

app
  .whenReady()
  .then(() => {
    createWindow();

    app.on('activate', () => {
      // on mac it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
