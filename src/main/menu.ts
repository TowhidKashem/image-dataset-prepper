import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron';
import { isDebug } from './main';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (isDebug) this.setupDevelopmentEnvironment();

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);

    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, { x, y }) => {
      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => this.mainWindow.webContents.inspectElement(x, y)
        }
      ]).popup({ window: this.mainWindow });
    });
  }

  // mac & linux menu
  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Electron',
      submenu: [
        {
          label: 'About ImageReviewer',
          selector: 'orderFrontStandardAboutPanel:'
        },
        { type: 'separator' },
        {
          label: 'Hide ImageReviewer',
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        {
          label: 'Show All',
          selector: 'unhideAllApplications:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => app.quit()
        }
      ]
    };

    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => this.mainWindow.webContents.reload()
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () =>
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
        },
        isDebug
          ? {
              label: 'Toggle Developer Tools',
              accelerator: 'Alt+Command+I',
              click: () => this.mainWindow.webContents.toggleDevTools()
            }
          : null
      ]
    };

    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        {
          label: 'Close',
          accelerator: 'Command+W',
          selector: 'performClose:'
        },
        { type: 'separator' },
        {
          label: 'Bring All to Front',
          selector: 'arrangeInFront:'
        }
      ]
    };

    return [subMenuAbout, subMenuViewDev, subMenuWindow];
  }

  // windows menu
  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O'
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => this.mainWindow.close()
          }
        ]
      },
      {
        label: '&View',
        submenu: [
          {
            label: '&Reload',
            accelerator: 'Ctrl+R',
            click: () => this.mainWindow.webContents.reload()
          },
          {
            label: 'Toggle &Full Screen',
            accelerator: 'F11',
            click: () =>
              this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
          },
          isDebug
            ? {
                label: 'Toggle &Developer Tools',
                accelerator: 'Alt+Ctrl+I',
                click: () => this.mainWindow.webContents.toggleDevTools()
              }
            : null
        ]
      }
    ];

    return templateDefault;
  }
}
