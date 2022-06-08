/*
 * @Author: zhanghouyi zhanghouyi@baoxiaohe.com
 * @Date: 2022-06-06 14:05:15
 * @LastEditors: zhanghouyi zhanghouyi@baoxiaohe.com
 * @LastEditTime: 2022-06-08 16:23:10
 * @FilePath: /electron-app/electronjs/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { app, BrowserWindow } = require("electron");
const path = require('path');
const fs=require('fs-extra');

let win;
const appName = '../zw';

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // and load the index.html of the app.
    win.loadFile("index.html");
    win.webContents.openDevTools();
    // Open the DevTools.
    // win.webContents.openDevTools();
    win.webContents.on('did-finish-load', installPlugin);
    win.on('closed', function () {
        win = null
    })
}
function installPlugin () {
    let baseBath
    let installPath
  
    if (process.platform === 'darwin') {
      // 测试不能加载插件
      baseBath = process.env['HOME'] + '/Library/Application Support/Adobe/'
    //   baseBath = '/Library/Application Support/Adobe/'
    } else {
      baseBath = process.env['USERPROFILE'] + '/AppData/Roaming/Adobe/'
    }
  
    installPath = baseBath + 'CEP/extensions/'

    movePlugin(installPath)
}
  
  function movePlugin (installPath) {
    // fs.writeFileSync(path.join(__dirname, 'drag-and-drop-1.md'), '# First file to test drag and drop')

    console.log('---movePlugin-----')
    console.log(process.env['HOME'])

    let home = process.env['HOME']
    
    // 打dmg文件，__dirname 对应的是/Volumes/ai-plugin 1.0.0/ai-plugins.app/Contents/Resources/app.asar。
    // fs.copyFileSync(path.join(__dirname,'../zw'), path.join(home,'/Library/Application Support/Adobe/CEP/extensions/'))
    
    // fs.chmod(path.resolve(installPath),0o400,function(err){
    //   console.log('err',err)
    //   console.log('aaaaaa',path.resolve(installPath));
    //   fs.writeFileSync('example.txt', "This file has now been edited.");
    // })

    fs.emptyDir(installPath, function (mkdirErr) {
        // path exists unless there was an error
        console.error('------',mkdirErr)
        fs.copy(path.join(__dirname, appName), path.resolve(installPath), function (err) {
          let message = 'loaded'
          if (err) {
            console.error('011111',err)
            message = err
          }
          win.webContents.send('status', message)
        })
    })
  }
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