"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const icon = path.join(__dirname, "../../resources/icon.png");
let spawn = require("child_process").spawn;
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 1800,
    // TODO: Change this to be percentage of screen width - will need to use node for this.
    height: 900,
    // TODO: Change this to be percentage of screen width - will need to use node for this.
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.on("open-program", () => {
    console.log("Execute program");
    spawn(
      "/home/catley/Linux_Unreal_Engine_5.4.3/Engine/Binaries/Linux/UnrealEditor",
      [
        "/home/catley/Documents/Unreal Projects/DELETE_ME_FPS/DELETE_ME_FPS.uproject"
        // Argument for cmd.exe to carry out the specified script
      ]
    );
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
