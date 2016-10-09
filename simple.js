"use strict";

var Proxy = require('./lib/hessian-proxy').Proxy;
var Long = require('long');
var Head = require('./lib/hessian-proxy').Head;
var banana = {
    "__type__": "com.zhu8fei.bean.Banana",
    "name": "bbb"
}
var listBean = {
    "__type__": "com.zhu8fei.bean.ListBean",
    "banana": banana,
    "str": "sss",
    "d": 1.2
}

var inputDto = {
    "__type__": "com.odianyun.soa.InputDTO",
    "companyId": Long.fromInt(2),
    "data": listBean
};


var proxy = new Proxy('http://127.0.0.1:8080/service/service/test', '', '', proxy);
proxy.invoke({"method": "getListBean", "head": new Head(2)}, [inputDto], function (err, reply) {
    if (err) {
        console.info('test2: ' + err);
    }
    console.info('test2: ' + JSON.stringify(reply));
})


