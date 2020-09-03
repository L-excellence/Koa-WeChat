'use strict'

let xml2js = require('xml2js');
let Promise = require('bluebird');

exports.formatMessage = function(result) {
    let message = {};
    if (typeof result === 'object') {
        let keys = Object.keys(result);
        for (let i = 0; i < keys.length; i ++) {
            let key = keys[i];
            let item = result[key];
            if (!(item instanceof Array) || item.length === 0) {
                continue;
            }
            if (item.length === 1) {
                let val = item[0];
                if (typeof val === 'object') {
                    message[key] = formatMessage(val);
                } else {
                    message[key] = (val || '').trim();
                }
            } else {
                message[key] = [];
                for (let j = 0; j < item.length; j ++) {
                    message[key].push(formatMessage[item[j]]);
                }
            }
        }
    }
    return message;
}

exports.parseXMLAsync = function(xml) {
    return new Promise(function(resolve, reject) {
        xml2js.parseString(xml, { trim: true }, function(err, content) {
            if (err) reject(err);
            else resolve(content);
        });
    })
}