import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
let spawn = require("child_process").spawn;

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1800, // TODO: Change this to be percentage of screen width - will need to use node for this.
    height: 900, // TODO: Change this to be percentage of screen width - will need to use node for this.
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('open-program', () => {
    // Replace '/path/to/your/program' with the actual path
    console.log("Execute program");
    // shell.openExternal('/usr/bin/gnome-calculator');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const bat = spawn("/home/catley/Linux_Unreal_Engine_5.4.3/Engine/Binaries/Linux/UnrealEditor",
    [
        "/home/catley/Documents/Unreal Projects/DELETE_ME_FPS/DELETE_ME_FPS.uproject",          // Argument for cmd.exe to carry out the specified script
    ]
    )
  })

  ipcMain.handle('auth:login', async () => {
    try {
      const tokens = await authService.authenticate();
      return tokens;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  });

  ipcMain.handle('auth:get-tokens', () => {
    return authService.getStoredTokens();
  });

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
