const { app, BrowserWindow } = require("electron");
const path = require('path'); //加载路径模块
const fs=require('fs');//加载node fs系统模块
// const adm_zip = require('adm-zip');
let win;
const appName = '/zw';

function createWindow() {
    //创建当前窗口
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    //加载资源
    win.loadFile("index.html");
    /**开启调试工具 */
    win.webContents.openDevTools();
    /**执行 目录复制操作 */
    win.webContents.on('did-finish-load', installPlugin);
    win.on('closed', function () {
        win = null
    })
}
function installPlugin () {
    let baseBath
    let installPath
  
    //加载 目标目录
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
    /**方式一 直接打包 当前目录进行拷贝 */
    _copyDir(path.join(__dirname, appName),installPath,()=>{
        console.log('拷贝成功')
    })
    /**方式二 在远程进行下载 拷贝 */
    //downZip('https://test.yun.baoxiaohe.com/ai//staticx7gj3y9q.zip')
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
/**拷贝过程 */
function _copyDir(src, dist, callback) {
    fs.access(dist, function(err){
      if(err){
        // 目录不存在时创建目录
        fs.mkdirSync(dist);
      }
      _copy(null, src, dist);
    });
  
    function _copy(err, src, dist) {
      if(err){
        callback(err);
      } else {
        fs.readdir(src, function(err, paths) {
          if(err){
            callback(err)
          } else {
            paths.forEach(function(path) {
              var _src = src + '/' +path;
              var _dist = dist + '/' +path;
              fs.stat(_src, function(err, stat) {
                if(err){
                  callback(err);
                } else {
                  // 判断是文件还是目录
                  if(stat.isFile()) {
                    fs.writeFileSync(_dist, fs.readFileSync(_src));
                  } else if(stat.isDirectory()) {
                    // 当是目录是，递归复制
                    _copyDir(_src, _dist, callback)
                  }
                }
              })
            })
          }
        })
      }
    }
}


 