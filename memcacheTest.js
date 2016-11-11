"use strict";

var nMemcached = require('memcached'),
    memcached,
    zlib = require("zlib");

memcached = new nMemcached("192.168.20.22:11211");

memcached.get("10_e591678498f34e3f971e4c72d341dd1e_0", function (err, result) {
    if (err) console.error(err);
    console.dir(result);

    var buffer = new Buffer(result);
    console.info(JSON.stringify(buffer));
    var bytes = zlib.gunzip(buffer, function (err, res) {
        if (err) console.error(err);
        console.info(JSON.stringify(res));
    });

    memcached.end(); // as we are 100% certain we are not going to use the connection again, we are going to end it
});
