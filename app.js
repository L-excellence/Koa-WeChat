'use strict'
let Koa = require('koa');
let path = require('path');
let util = require('./utils');
const WeChat = require('./middleware/generator');
const wechat_file = path.join(__dirname, './config/wechat.txt');
const config = {
    wechat: {
        appID: 'wxfa29eed4e67728fe', // 测试号管理中的appID
        appSecret: 'ae74da886775dd22fc62118ce77d324c', // 测试号管理中的appsecret
        token: 'indflkasopdsfwekadas', // 自己随机定义的token，用于接口配置信息中
        getAccessToken: function() {
            return util.readFileAsync(wechat_file);
        },
        saveAccessToken: function(data) {
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_file, data);
        }
    }
}

let app = new Koa();
app.use(WeChat(config.wechat));

app.listen(1234, function() {
    console.log('listening: 1234');
});
