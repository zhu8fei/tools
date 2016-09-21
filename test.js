"use strict";

var Proxy = require('hessian-proxy').Proxy;

var proxy = new Proxy('http://localhost:8080/ouser-service/ouserService/userLoginService', '', '', proxy);
/*var str = "30f74983fd7340bebbdfea2a227fb0e9";
// str.__type__='java.lang.String';
proxy.invoke('getUserByLoginCookie', [str], function (err, reply) {
    console.log("err:"+err);
    console.log('test: ' + JSON.stringify(reply));
});*/

var argObj = {
    'companyId':7,
    'data':"30f74983fd7340bebbdfea2a227fb0e9"
};
 
argObj.__type__ = 'com.odianyun.soa.InputDTO';
//argObj.__type__ = 'java.lang.String';

proxy.invoke('c12getUserByLoginCookieByCompanyId', [argObj], function (err, reply) {
    if (err) {
        console.log('test2: ' + err);
    }
 
    console.log('test2: ' + JSON.stringify(reply));
})

