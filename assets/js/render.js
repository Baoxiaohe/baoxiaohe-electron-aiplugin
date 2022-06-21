
const {ipcRenderer}=require('electron');
/**获取dom */
let openPlugin=document.getElementById('openPlugin');
let versionTxt=document.getElementById('version');

openPlugin.onclick=sendMessageToMainProcess
function sendMessageToMainProcess(){
    console.log(deepDfs(root));
    console.log(deepBFS2(root))
    ipcRenderer.send("render-to-main-message", '21212');
}

/**接收来自主进程 返回的版本信息 */
ipcRenderer.on('pluginVersion', (event, args)=>{
    versionTxt.innerHTML=args
})
/**主进程收到消息后 的回调函数 */
ipcRenderer.on('receiveMessage', (event, args)=>{
    console.log('接收到主进程的消息',args)
})

