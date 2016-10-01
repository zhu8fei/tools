"use strict";

var Proxy = require('./lib/hessian-proxy').Proxy;

var argObj = {
    "companyId":2,
    "data":"test"

};


var proxy = new Proxy('http://127.0.0.1:8080/service/service/test', '', '', proxy);
argObj.__type__ = 'com.odianyun.soa.InputDTO';

proxy.invoke('simple', [argObj], function (err, reply) {
    if (err) {
        console.info('test2: ' + err);
    }
    console.info(reply);
    console.info('test2: ' + JSON.stringify(reply));
})