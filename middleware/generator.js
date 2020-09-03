'use strict'
let sha1 = require('sha1');
let getRawBody = require('raw-body');
let Wechat = require('./wechat');
let util = require('./util');

/** 接入微信公众号测试号逻辑 */
module.exports = function(options) {
    let wechat = new Wechat(options);

    return function *(next) {
        // console.log(this.query); 
    
        let token = options.token;
        // 以下参数都是通过微信接口配置信息页面提交时所传递的参数
        let signature = this.query.signature;
        let nonce = this.query.nonce;
        let timestamp = this.query.timestamp;
        let echostr = this.query.echostr;
        let str = [token, timestamp, nonce].sort().join(''); // 对三者进行字典排序
        let sha = sha1(str); // 对排序后的字符串进行加密

        if (this.method === 'GET') {
            if (sha === signature) {
                this.body = echostr + ''; // 如果是微信配置接口发送来的请求，将ecostr返回给微信
            } else {
                this.body = 'wrong'; // 否则不是微信配置服务发送的请求
            }
        } else if (this.method === 'POST') { // POST请求触发方式：关注公众号、
            if (sha !== signature) { // 判断是不是微信服务器发送的post请求，不是退出请求
                this.body = 'wrong';
                return false;
            }
            // 微信服务器发送的POST请求数据是xml形式，所以需要通过raw-body解析xml
            let data = yield getRawBody(this.req, {
                length: this.length,
                limit: '1mb', // 设置最大post请求参数体积
                encoding: this.charset
            });
            let content = yield util.parseXMLAsync(data); // 将xml解析为js对象
            let message = util.formatMessage(content.xml); // 对象的值是一个数组，通常length为1，将数据从数组中取出作为value
            console.log('message!!!: ', message);

            if (message.MsgType === 'event') {
                if (message.Event === 'subscribe') { // 关注公众号发送的POST请求
                    let now = new Date().getTime();
                    this.status === 200;
                    this.type === 'application/xml';
                    this.body = `<xml>
                        <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                        <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                        <CreateTime>${now}</CreateTime>
                        <MsgType><![CDATA[text]]></MsgType>
                        <Content><![CDATA[欢迎关注远扬的公众号]]></Content>
                    </xml>`;
                }
            }
        }
        
    }
}
