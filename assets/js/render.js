/*
 * @Author: zhanghouyi zhanghouyi@baoxiaohe.com
 * @Date: 2022-06-16 14:28:01
 * @LastEditors: zhanghouyi zhanghouyi@baoxiaohe.com
 * @LastEditTime: 2022-06-21 17:18:50
 * @FilePath: /baoxiaohe-electron-aiplugin/assets/js/render.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const {ipcRenderer}=require('electron');
/**获取dom */
let openPlugin=document.getElementById('openPlugin');
let versionTxt=document.getElementById('version');
let path=document.getElementById('path');

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
ipcRenderer.on('path', (event, args)=>{
    path.innerHTML=args
})
/**主进程收到消息后 的回调函数 */
ipcRenderer.on('receiveMessage', (event, args)=>{
    console.log('接收到主进程的消息',args)
})

