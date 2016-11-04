var BufferReader = require('buffer-reader');
var Long = require('long');


var what = {
    "saa" : "sd"

}
what.__type__ = "com.zhu8fei"

for(var a in what ){
    console.info(a)
}


console.info(new Date('2016-09-09 12:00:00').getTime())

var test =Long.fromInt(2);
console.info(test instanceof Long);

var readString = function(data) {
    var reader;
    if (data)
        reader = new BufferReader(data);

    var code = reader.nextUInt8();
    if (code >= 0 && code < 32) {
        return reader.nextString(code);
    } else if (code >= 0x30 && code <= 0x33) {
        reader.move(-1);
        var len = reader.nextUInt16BE() - 0x3000;
        return reader.nextString(len);
    } else if (code === 0x53) {
        var len = reader.nextUInt16BE();
        return reader.nextString(len);
    } else if (code === 0x52) {
        var len = reader.nextUInt16BE();
        return reader.nextString(len) + readString();
    }
};

console.info(readString(new Buffer([228,184,173])));
