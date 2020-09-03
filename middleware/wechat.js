'use strict'
let Promise = require('bluebird');
let request = Promise.promisify(require('request'));

const baseUrl = ' https://api.weixin.qq.com/cgi-bin';
const api = {
    accessToken: baseUrl + '/token?grant_type=client_credential',
}

/** Wechat 实例用于管理微信接口，如：获取 accessToken (票据) */
function Wechat(options) {
    this.appID = options.appID;
    this.appSecret = options.appSecret;
    this.getAccessToken = options.getAccessToken;
    this.saveAccessToken = options.saveAccessToken;
    this.getAccessToken().then(data => {
        try {
            data = JSON.parse(data);
        } catch (e) {
            return this.updateAccessToken(data); // 获取AccessToken失败时更新AccessToken
        }
        // 判断AccessToken有效
        if (this.isValidAccessToken(data)) {
            return data;
        } else {
            return this.updateAccessToken(data);
        }
    }).then(data => {
        this.access_token = data.access_token;
        this.expires_in = data.expires_in; // 票据过期时间
        this.saveAccessToken(data);
    })
}
Wechat.prototype.isValidAccessToken = function(data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }

    let expires_in = data.expires_in;
    let now = new Date().getTime();
    if (now < expires_in) {
        return true;
    } else {
        return false;
    }
}
Wechat.prototype.updateAccessToken = function() {
    let appID = this.appID;
    let appSecret = this.appSecret;
    let url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret;

    return new Promise(function(resolve, reject) {
        request({ url, json: true }).then(function(response) {
            if (!response.body) return false;

            let data = response.body;
            let now = new Date().getTime();
            // 计算过期时间，根据微信接口返回的expires_in(通常为7200)，这里提前20m超时(提前获取新的)
            let expires_in = now + (data.expires_in - 20) * 1000;
            data.expires_in = expires_in;
            resolve(data);
        });
    });
}

module.exports = Wechat;
