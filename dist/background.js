chrome.runtime.onInstalled.addListener(function() {

    // 安装事件， 常驻后台的逻辑可以写在这里
    // chrome.storage.sync.set({color: '#3aa757'}, function() {
    //     console.log('The color is green.');
    // });
    console.log("插件已经成功安装");
});