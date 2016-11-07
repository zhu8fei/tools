"use strict";

/**
 * Created by Wang Pengfei on 2016/9/27.
 */
var assert = require('assert');

function Input() {
    this.data = {};
    this.next = 0;
    this.refClass = [];
};
/**
 * 定义 122 结束对象.
 * @type {{end: string}}
 */
const end = {"end": "122"};

Input.prototype.call = function (result) {
    // console.info("to call ");
    this.start(result);
    this.data.heads = this.readHeads(result);
    this.data.result = this.readBody(result);
    // console.info(" refClass  " + JSON.stringify(this.refClass));
    return this.data;
};
/**
 * 协议头.
 * @param result
 * @returns {{}|*}
 */
Input.prototype.start = function (result) {
    this.next += 3;
    if (result[0] != 114) {
        throw new Error("返回信息不正确.");
    }
    return this.data;
};
/**
 * 读消息头.
 * @param result
 * @returns {*}
 */
Input.prototype.readHeads = function (result) {
    var key = result[this.next];
    if (key != 72) {
        return null;
    }
    this.next++;
    var heads = {};
    // 后续实现. 目前没有写入返回头.
    return heads;
};
/* 后续实现. 目前没有写入返回头.
 Input.prototype.readHead = function (result) {

 };*/
/**
 * 消息体
 * @param result
 * @returns {*}
 */
Input.prototype.readBody = function (result) {
    // console.info("readBody");
    var key = result[this.next];
    if (key == 102) {
        // console.info("这返回了一个错误.");
        return this.readError(result);
    } else {
        this.next--;
        // console.info("这返回了一个结果.");
        return this.read(result);
    }

    throw new Error("报文格式错误.");
};
/**
 * 读异常返回
 * @param result
 * @returns {*}
 */
Input.prototype.readError = function (result) {
    // console.info("readError");
    var errMsg = this.readObject(result);
    return errMsg;
};
/**
 * 返回访问结果.
 * @param result
 * @returns {*}
 */
Input.prototype.readResult = function (result) {
    // console.info("readResult");
    this.next++;
    var key = result[this.next];
    if (key != 116) {
        throw new Error("报文格式错误.");
    }

    return errMsg;
};
/**
 * 读内容.
 * @param result
 * @returns {*}
 */
Input.prototype.read = function (result) {
    this.next++;
    var key = result[this.next];
    // console.info("read  key: " + key)

    switch (key) {
        case 78:
            return this.readNull();
        case 68:
            return this.readDouble(result);
        case 70:
            return false;
        case 73:
            return this.readInt(result);
        case 76:
            return this.readLong(result);
        case 66:
        case 98:
            // 没有实现.有坑
            return this.readBytes(result);
        case 84:
            return true;
        case 83:
        case 115:
            return this.readString(result);
        case 77:
            var type = this.readType(result);
            var obj = this.readObject(result);
            if (type && obj) {
                obj.__type__ = type;
            }
            return obj;
        case 82:
            return this.readRef(result);
        case 86:
            var type = this.readType(result);
            var list = this.readList(result);
            if (type && list) {
                list.__type__ = type;
            }
            return list;
        case 100:
            return this.readDate(result);
        case 109:
            return this.readMoreString(result);
        case 122:
            return end;
        default:
            break;
    }

    return this.data;
};
/**
 * 读字符对象.
 * @param result
 * @param more
 * @returns {*}
 */
Input.prototype.readString = function (result, more) {
    var word = '';
    if (more) {
        word += more;
    }
    var key = result[this.next];
    if (key == 83) {
        word = this.readMoreString(result, word);
        return word;
    } else if (key == 115) {
        word = this.readMoreString(result, word);
        this.next++;
        return this.readString(result, word);
    }
    return null;
};
/**
 * 读取更多字符串
 * @param result
 * @param word
 * @returns {*}
 */
Input.prototype.readMoreString = function (result, word) {
    var len = this.readLen(result);
    if (len == 0) {
        return null;
    }
    var byte = [];
    var index = 0;
    for (var i = 0; len > i; i++) {

        this.next++;
        var b = result[this.next];
        byte[index] = b ;
        if(b<=0x7f){
        } else {
            index++;
            this.next++;
            var b = result[this.next];
            byte[index] = b ;
            index++;
            this.next++;
            var b = result[this.next];
            byte[index] = b ;
        }
        byte[index] = result[this.next];
        index++;
    }
    if (!word) {
        word = '';
    }
    word += new Buffer(byte).toString();
    // console.info("readMoreString    " + word);
    return word;
};

/**
 * 读取空对象.
 * @returns {null}
 */
Input.prototype.readNull = function () {
    return null;
};
/**
 * 读取int
 * @param result
 * @returns {number}
 */
Input.prototype.readInt = function (result) {
    return this.readLen(result, 4);
};
/**
 * 读long.
 * @param result
 * @returns {number}
 */
Input.prototype.readLong = function (result) {
    return this.readLen(result, 8);
};

/**
 * 读Date.
 * @param result
 * @returns {number}
 */
Input.prototype.readDate = function (result) {
    var longTime = this.readLen(result, 8);
    var date = new Date();
    date.setTime(longTime);
    return date;
};

/**
 * 读double.
 * @param result
 * @returns {number}
 */
Input.prototype.readDouble = function (result) {
    var b = this.readByteArray(result, 8);
    return  new Buffer(b).readDoubleBE(0);
};


/**
 * 读取映射. 对象映射举例 { "ref":{"a":"b" }  ,"list":[{"a":"b"}] }
 * 如果 list[0] === ref 的情况,hassien中视为映射(refClass)
 * @param result
 * @returns {*}
 */
Input.prototype.readRef = function (result) {
    var len = this.readLen(result, 4);
    // console.info("readRef : " + len);
    return this.refClass[len];
};
/**
 * 读取对象
 * @param result
 * @returns {*}
 */
Input.prototype.readObject = function (result) {
    var obj = {};
    // 原以为完成时,再写入对象. 发现每次都算.
    this.refClass[this.refClass.length] = obj;
    var method = [];
    while (true) {
        var key = this.read(result);
        // 返回一个结尾
        if (key === end) {
            // console.info("readObject :" + JSON.stringify(obj));
            return obj;
        }
        var value = '';
        if (result[this.next] == 109) {
            method[method.length] = key;
        } else {
            value = this.read(result);
            obj[key] = value;
        }
    }

    return null;
};
/**
 * 读取类型
 * @param result
 * @returns {null}
 */
Input.prototype.readType = function (result) {
    if (result[this.next + 1] != 116) {
        return null;
    }
    this.next++;
    return this.readMoreString(result);
};
/**
 * 读取一个list
 * @param result
 * @returns {*}
 */
Input.prototype.readList = function (result) {
    var list = [];
    if (result[this.next + 1] == 108) {
        this.next++;
    } else {
        return null;
    }

    var len = this.readLen(result, 4);
    for (var i = 0; i < len; i++) {
        list[i] = this.read(result);
    }
    return list;
};
/**
 * byte 数组
 * @param result
 * @returns {*}
 */
Input.prototype.readBytes= function (result) {
    if (result[this.next + 1] == 78) {
        this.next++;
    } else {
        return null;
    }
    var len = this.readLen(result);
    if (len == 0) {
        return null;
    }
    var byte = [];
    for (var i = 0; len > i; i++) {
        this.next++;
        byte[i] = result[this.next];
    }
    return byte;
};

/**
 * byte 数组
 * @param result
 * @returns {*}
 */
Input.prototype.readByteArray= function (result , len) {
    var byte = [];
    for (var i = 0; len > i; i++) {
        this.next++;
        byte[i] = result[this.next];
    }
    return byte;
};

/**
 * 读取长度  默认为2位
 * @param result
 * @param bit  1*8 bit
 * @returns {number}
 */
Input.prototype.readLen = function (result, bit) {
    // 默认长度2
    var len = 0;
    if (!bit) {
        bit = 2;
    }
    for (var i = bit; i > 0; i--) {
        this.next++;
        len += (result[this.next] << ((i - 1) * 8));
    }
    // console.info("read len : " + len);
    return len;
};
module.exports = Input;