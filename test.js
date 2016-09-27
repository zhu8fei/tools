"use strict";

var Proxy = require('./lib/hessian-proxy').Proxy;

// var proxy = new Proxy('http://localhost:8080/ouser-service/ouserService/userLoginService', '', '', proxy);
/*var str = "30f74983fd7340bebbdfea2a227fb0e9";
// str.__type__='java.lang.String';
proxy.invoke('getUserByLoginCookie', [str], function (err, reply) {
    console.log("err:"+err);
    console.log('test: ' + JSON.stringify(reply));
});*/
// 尝试版本1
// proxy.version=1;
/*
var argObj = {
    "companyId":7,
    "data":"30f74983fd7340bebbdfea2a227fb0e9"
};

argObj.__type__ = 'com.odianyun.soa.InputDTO';*/
/*var argObj ="30f74983fd7340bebbdfea2a227fb0e9";

proxy.invoke('getUserByLoginCookie', [argObj], function (err, reply) {
    if (err) {
        console.info('test2: ' + err);
    }
    console.info(reply);
    console.info('test2: ' + JSON.stringify(reply));
})*/



var argObj = {
    "companyId":2,
    "data":{
        "id":520
    }

};


var proxy = new Proxy('http://localhost:8080/ouser-service/ouserService/userService', '', '', proxy);
argObj.__type__ = 'com.odianyun.soa.InputDTO';
argObj.data.__type__='com.odianyun.user.dto.DTO.UserInDTO';

proxy.invoke('getUserByConditions', [argObj], function (err, reply) {
    if (err) {
        console.info('test2: ' + err);
    }
    console.info(reply);
    console.info('test2: ' + JSON.stringify(reply));
})

