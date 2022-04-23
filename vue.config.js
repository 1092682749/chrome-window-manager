const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

// 复制文件到指定目录
const copyFiles = [
    {
        from: path.resolve("src/manifest.json"),
        to: `${path.resolve("dist")}/manifest.json`
    },
    {
        from: path.resolve("src/icon"),
        to: path.resolve("dist/img")
    },
    {
        from: path.resolve("src/background/background.js"),
        to: path.resolve("dist/background.js")
    }
];

const plugins = [
    new CopyWebpackPlugin({
        patterns: copyFiles
    })
];

// 页面文件
const pages = {};
// 配置 popup.html 页面
const chromeName = ["popup"];

chromeName.forEach(name => {
    pages[name] = {
        entry: `src/main.js`,
        template: `/public/index.html`,
        filename: `${name}.html`
    };
});

module.exports = {
    pages,
    productionSourceMap: false,
    // 配置 content.js background.js
    configureWebpack: {
        plugins
    },
    // 关闭eslint 不然chrome对象报错
    lintOnSave: false
}