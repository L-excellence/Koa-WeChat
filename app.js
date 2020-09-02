'use strict'

let Koa = require('koa');
let sha1 = require('sha1');
const config = {
    wechat: {
        appID: 'wxfa29eed4e67728fe', // 测试号管理中的appID
        appSecret: 'ae74da886775dd22fc62118ce77d324c', // 测试号管理中的appsecret
        token: 'indflkasopdsfwekadas' // 自己随机定义的token，用于接口配置信息中
    }
}

let app = new Koa();
app.use(function *(next) {
    console.log(this.query); 

    let token = config.wechat.token;
    // 以下参数都是通过微信接口配置信息页面提交时所传递的参数
    let signature = this.query.signature;
    let nonce = this.query.nonce;
    let timestamp = this.query.timestamp;
    let echostr = this.query.echostr;
    let str = [token, timestamp, nonce].sort().join(''); // 对三者进行字典排序
    let sha = sha1(str); // 对排序后的字符串进行加密
    if (sha === signature) {
        this.body = echostr + ''; // 如果是微信配置接口发送来的请求，将ecostr返回给微信
    } else {
        this.body = 'wrong'; // 否则不是微信配置服务发送的请求
    }
})

app.listen(1234, function() {
    console.log('listening: 1234');
});
