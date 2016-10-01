/**
 * Created by Wang Pengfei on 2016/9/27.
 *
 * 预计实现: bean map list
 */


/**
 * Created by Wang Pengfei on 2016/9/27.
 */
var assert = require('assert'),
    BufferBuilder = require('buffer-builder'),
    Long = require('long');


function Input(initial) {
    this.builder = new BufferBuilder(initial);
    this.classDefs = {};
    this.typeRefs = {};
    this.valueRefs = [];
}

Input.prototype.call = function (args, data) {
    // 写入请求头
    this.startCall(args);
    // 写入方法
    this.callMethod(args);
    // 如果存在参数,则写入参数
    if (data) {
        for (var i = 0, len = data.length; i < len; ++i) {
            var arg = data[i];
            if (arg && arg.__type__)
                this.writeObject(arg, arg.__type__);
            else
                this.write(data[i]);
        }
    }

    // 固定写入结尾
    this.end();
    console.info(JSON.stringify(this.builder));
    return this;
}
Input.prototype.startCall = function (args) {
    this.builder.appendUInt8(99);
    this.builder.appendUInt8(1);
    this.builder.appendUInt8(0);
    if (args.isHead) {
        this.writeHead(args.head);
    }
}

Input.prototype.callMethod = function (args) {
    this.builder.appendUInt8(109);
    var len = args.method.length;
    this.builder.appendUInt8(len >> 8);
    this.builder.appendUInt8(len);
    this.builder.appendString(args.method);
}

Input.prototype.end = function () {
    this.builder.appendUInt8(122);
}

Input.prototype.writeHead = function (data) {

}

Input.prototype.write = function (data) {
    
}
/**
 * 写对象, 实际是写对象参数.调用此方法前,需要考虑是不是先调用writeMap
 * @param data
 */
Input.prototype.writeObject = function (data, type) {
    if (type) {
        this["write" + cap(type)](data)
    }
}
/**
 * List 类型开始.
 * @param data
 */
Input.prototype.writeListBegin = function (data) {
    this.builder.appendUInt8(86);
    if(data.__argsType__){
        this.builder.appendUInt8(116);
        var atlen = data.__argsType__.length;
        this.builder.appendUInt8(atlen>>8);
        this.builder.appendUInt8(atlen);
        this.builder.appendString(data.__argsType__);
    }


}
Input.prototype.writeListEnd = function (data) {

}
/**
 * osoa中, 对象使用map方式. 实际使用type区别.
 */
Input.prototype.writeMapBegin = function (data) {
    this.builder.appendUInt8(77);
    this.builder.appendUInt8(116);
    this.builder.appendString(data.__type__);
}
Input.prototype.writeMap = function (data) {
    this.writeMapBegin(data);
    this.writeObject(data);
    this.end();
}


Input.prototype.writeBoolean = function (data) {

}
Input.prototype.writeInt = function (data) {

}
Input.prototype.writeLong = function (data) {

}
Input.prototype.writeDouble = function (data) {

}
Input.prototype.writeUTCDate = function (data) {

}
Input.prototype.writeNull = function (data) {
    this.builder.appendUInt8(78);
}
Input.prototype.writeString = function (data) {

}
Input.prototype.writeBytes = function (data) {

}
Input.prototype.getBuffer = function () {
    return this.builder.get();
};
function isInt(data) {
    return typeof data === 'number' && parseFloat(data) === parseInt(data, 10) && !isNaN(data);
}

function isFloat(data) {
    return typeof data === 'number' && parseFloat(data) !== parseInt(data, 10) && !isNaN(data);
}

function cap(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
var i = new Input(30);
i.call({"method": "test"}, {"String": "ss"})
module.exports = Input;