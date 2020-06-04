const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const createWindow = () => {
  const win = new BrowserWindow({
    width: 700,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (isDev) {
    // 打开开发者工具
    win.webContents.openDevTools();
    win.loadURL("http://localhost:3000/");
  } else {
    win.loadURL(`file://${path.join(__dirname, "./build/index.html")}`);
  }


};

app.whenReady().then(createWindow);

//当所有窗口都被关闭后退出
app.on("window-all-closed", () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
