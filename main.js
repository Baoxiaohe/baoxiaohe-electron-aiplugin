const { app, BrowserWindow } = require("electron");

const path = require('path'); //加载路径模块
const fs=require('fs');//加载node fs系统模块
const axios = require("axios").default;
const adm_zip = require('adm-zip');
const baseURL='https://www.baoxiaohe.com';
const axiosClient = axios.create({
  baseURL,
  headers: {
    "Session-Access-Origin": "xxx",
    "Content-Type": "application/json",
  },
});
let win;
const appName = '/zw';
const { ipcMain } = require('electron')
function createWindow() {
    //创建当前窗口
    win = new BrowserWindow({
        width: 349,
        height: 525,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true
        },
    });
    console.log('__dirname__dirname',__dirname)
    //加载资源
    win.loadFile("index.html");
    /**开启调试工具 */
    // win.webContents.openDevTools();
    /**执行 目录复制操作 */
    win.webContents.on('did-finish-load', installPlugin);
    win.on('closed', function () {
        win = null
    })
}
let installPath
function installPlugin () {
    let baseBath
    //加载 目标目录
    if (process.platform === 'darwin') {
      // 测试不能加载插件
      baseBath = process.env['HOME'] + '/Library/Application Support/Adobe/'
      //baseBath = '/Library/Application Support/Adobe/'
    } else {
      baseBath = process.env['USERPROFILE'] + '/AppData/Roaming/Adobe/'
    }
    installPath = baseBath + 'CEP/extensions/ai-cep'
    movePlugin(installPath)
}
  
function movePlugin (installPath) {
  axiosClient
  .get("api/v2/config/?key=ai-cep-plugin-download")
  .then((res) => {
    const data = res.data;
    console.log(data);
    if(data&&data.code===200){
      if(data.data&&data.data.macUrl){
        downZip(data.data.macUrl);
        /**将版本号给到渲染进程 */
        win.webContents.send("pluginVersion", data.data.version)
      }
    }
  })
  .catch((err) => console.log(err));
}

  /**准备 */
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
/**远程下载 */
function downZip(url){
    win.webContents.downloadURL(url);
    win.webContents.session.once('will-download', (event, item, webContents) => {
    //设置保存路径
    const filePath = path.join(installPath, `bxh-ai-plugin.zip`);

    item.setSavePath(filePath);
    // item.on('updated', (event, state) => {
    //   if (state === 'interrupted') {
    //     console.log('下载中断，可以继续');
    //   } else if (state === 'progressing') {
    //     if (item.isPaused()) {
    //       console.log('下载暂停');
    //     } else {
    //       console.log(`当前下载项目的接收字节${item.getReceivedBytes()}`);
    //       console.log(`下载完成百分比：${item.getReceivedBytes() / item.getTotalBytes() * 100}`);
    //     }
    //   }
    // });
    item.once('done', (event, state) => {
      if (state === 'completed') {
        var unzip = new adm_zip(filePath);
        unzip.extractAllTo(installPath, /*overwrite*/true,);
        fs.unlink(filePath,(e)=>{
            console.log('eee',e)
        })
      }
    })
  })
}

/**主进程接收消息 */
ipcMain.on("render-to-main-message", (event, message) => {
  // 主进程回调消息 告诉渲染进程执行完毕
  win.webContents.send("receiveMessage", "我是主进程已收到消息" + message)
})