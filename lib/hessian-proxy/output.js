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
    Long = require('long'),
    NumUtils = require('./numUtils');
var numUtils = new NumUtils();

function Output(initial) {
    this.builder = new BufferBuilder(initial);
};
/**
 * 请求方法.
 * @param method 调用方法描述, 包括请求头.
 * @param data 参数值
 * @returns {Output}
 */
Output.prototype.call = function (method, data) {
    // 写入请求头
    this.startCall(method);
    // 写入方法
    this.callMethod(method);
    // 如果存在参数,则写入参数
    if (data) {
        for (var i = 0, len = data.length; i < len; ++i) {
            var arg = data[i];
            /*  if (arg && arg.__type__)
             this.writeObject(arg.data, arg.__type__);
             else*/
            this.write(arg);
        }
    }

    // 固定写入结尾
    this.end();
    console.info(JSON.stringify(this.getBuffer()));
    return this;
};
/**
 * 方法开始
 * @param args
 */
Output.prototype.startCall = function (args) {
    // 固定 9910
    this.builder.appendUInt8(99);
    this.builder.appendUInt8(1);
    this.builder.appendUInt8(0);
    // 写入请求头.
    if (args.head) {
        this.writeHead(args.head);
    }
    return this;
};

Output.prototype.callMethod = function (args) {
    this.builder.appendUInt8(109);
    var len = args.method.length;
    this.builder.appendUInt8(len >> 8);
    this.builder.appendUInt8(len);
    this.builder.appendString(args.method);
    return this;
};
/**
 * 能用结束符.
 */
Output.prototype.end = function () {
    this.builder.appendUInt8(122);
    return this;
};
/**
 * 写入头.
 * @param data
 */
Output.prototype.writeHead = function (data) {
    // 如果需要添加请求头.
    var heads = data.heads;
    for (var i = 0; i < heads.length; i++) {
        this.builder.appendUInt8(72);
        var head = heads[i].head;
        var len = head.name.length;
        this.builder.appendUInt8(len >> 8);
        this.builder.appendUInt8(len);
        // 写入头名
        this.printString(head.name, 0, head.name.length)
        
        // 如果有类型
        if (head && head.__type__) {
            this.write(head.data, head.__type__);
        } else {
            this.write(head.data);
        }

    }
    return this;
};

Output.prototype.write = function (data, type) {
    if (type)
        this['write' + numUtils.cap(type)](data);
    else if (data === null || data === undefined) {
        this.writeNull();
    } else if (typeof data === 'boolean') {
        this.writeBoolean(data);
    } else if (typeof data === "string") {
        this.writeString(data);
    } else if (numUtils.isInt(data)) {
        this.writeInt(data);
    } else if (data instanceof Long || numUtils.isInt(data.high) && numUtils.isInt(data.low)) {
        this.writeLong(data);
    } else if (numUtils.isFloat(data)) {
        this.writeDouble(data);
    } else if (data instanceof Date) {
        this.writeUTCDate(data);
    } else if (data instanceof Buffer) {
        this.writeBytes(data.data);
    } else if (data instanceof Array) {
        this.writeList(data);
    } else if (data.__type__ && (data.__type__ == 'java.util.List' || numUtils.startWitch(data.__type__, '['))) {
        this.writeList(data);
    } else if (typeof data.__type__ === 'string') {
        // object
        this.writeObject(data);
    } else {
        // map
        this.writeMap(data);
    }

    return this;
};
/**
 * 写对象, 实际是写对象参数.调用此方法前,需要考虑是不是先调用writeMap
 * @param data
 */
Output.prototype.writeObject = function (data, type) {
    // 类型存在 ,拼装方法.并调用
    if (type) {
        this["write" + numUtils.cap(type)](data)
    } else {
        this.writeMapBegin(data);
        this.writeObjectBody(data);
        this.end();
    }
    return this;
};
/**
 * 写对象体
 * @param data
 * @returns {Output}
 */
Output.prototype.writeObjectBody = function (data) {
    for (var arg in data) {
        if (arg == '__type__') {
            continue;
        }
        this.writeString(arg);
        this.write(data[arg]);
    }

    return this;
};
/**
 * List 类型开始.
 * @param type 类型
 * @param len 长度
 * @returns {Output}
 */
Output.prototype.writeListBegin = function (type, len) {
    this.builder.appendUInt8(86);
    if (type) {
        this.builder.appendUInt8(116);
        var typeLen = type.length;
        this.builder.appendUInt8(typeLen >> 8);
        this.builder.appendUInt8(typeLen);
        this.builder.appendString(type);
    }
    if (len >= 0) {
        this.builder.appendUInt8(108);
        this.builder.appendUInt8(len >> 24);
        this.builder.appendUInt8(len >> 16);
        this.builder.appendUInt8(len >> 8);
        this.builder.appendUInt8(len);
    }

    return this;
};
/**
 * list  数组  多维数组 没有分析.
 * @param data
 * @returns {Output}
 */
Output.prototype.writeList = function (data) {
    var start = 0;
    var len, type, objs;
    type = data.__type__;
    len = data.data.length;
    objs = data.data;
    this.writeListBegin(len, type);

    // 写入值
    for (var i = start; i < len; i++) {
        this.write(objs[i]);
    }
    this.end();
    return this;
};
/**
 * osoa中, 对象使用map方式. 实际使用type区别.
 */
Output.prototype.writeMapBegin = function (data) {
    this.builder.appendUInt8(77);
    this.builder.appendUInt8(116);
    var len = data.__type__.length;
    this.builder.appendUInt8(len>>8);
    this.builder.appendUInt8(len);
    this.builder.appendString(data.__type__);
    return this;
};
Output.prototype.writeMap = function (data) {
    this.writeMapBegin(data);
    this.writeObjectBody(data);
    this.end();
    return this;
};

/**
 * boolean
 * @param data
 */
Output.prototype.writeBoolean = function (data) {
    if (data) {
        this.builder.appendUInt8(84);
    } else {
        this.builder.appendUInt8(70);
    }
    return this;
};
/**
 * int
 * @param data
 */
Output.prototype.writeInt = function (data) {
    this.builder.appendUInt8(73);
    this.builder.appendUInt8(data >> 24);
    this.builder.appendUInt8(data >> 16);
    this.builder.appendUInt8(data >> 8);
    this.builder.appendUInt8(data);
    return this;
};
/**
 * Long
 * @param data
 */
Output.prototype.writeLong = function (data) {
    this.builder.appendString('L');
    this.builder.appendInt32BE(data.high);
    this.builder.appendUInt32BE(data.low);
    return this;
};
/**
 * Double
 * @param data
 */
Output.prototype.writeDouble = function (data) {
    var value = data;
    this.builder.appendUInt8(68);
    this.builder.appendDoubleBE(value);
    return this;
};
/**
 * UTC 时间类型
 * @param data
 */
Output.prototype.writeUTCDate = function (data) {
    var value = data.getTime();
    this.builder.appendUInt8(100);
    this.builder.appendUInt8(value >> 56);
    this.builder.appendUInt8(value >> 48);
    this.builder.appendUInt8(value >> 40);
    this.builder.appendUInt8(value >> 32);
    this.builder.appendUInt8(value >> 24);
    this.builder.appendUInt8(value >> 16);
    this.builder.appendUInt8(value >> 8);
    this.builder.appendUInt8(value);
    return this;
};
/**
 * 空对象
 * @param data
 */
Output.prototype.writeNull = function () {
    this.builder.appendUInt8(78);
    return this;
};
/**
 * String 类型
 * @param data
 */
Output.prototype.writeString = function (data) {
    if (!data) {
        this.writeNull();
    } else {
        var len = data.length;
        var sublen = 0;
        var offset = 0;


        for (offset = 0; len > 32768; offset += sublen) {
            sublen = 32768;


            var tail = data.charCodeAt(offset + sublen - 1);
            if (55296 <= tail && tail <= 56319) {
                --sublen;
            }

            this.builder.appendUInt8(115);
            this.builder.appendUInt8(sublen >> 8);
            this.builder.appendUInt8(sublen);
            this.printString(data, offset, sublen);
            len -= sublen;
        }

        this.builder.appendUInt8(83);
        this.builder.appendUInt8(len >> 8);
        this.builder.appendUInt8(len);
        this.printString(data, offset, len);

    }
    return this;
};
Output.prototype.printString = function (data, offset, len) {
    for (var i = 0; i < len; ++i) {
        var ch = data.charCodeAt(i + offset);
        if (ch < 128) {
            this.builder.appendUInt8(ch);
        } else if (ch < 2048) {
            this.builder.appendUInt8(192 + (ch >> 6 & 31));
            this.builder.appendUInt8(128 + (ch & 63));
        } else {
            this.builder.appendUInt8(224 + (ch >> 12 & 15));
            this.builder.appendUInt8(128 + (ch >> 6 & 63));
            this.builder.appendUInt8(128 + (ch & 63));
        }
    }
    return this;
};
/**
 * bytes
 * @param data
 */
Output.prototype.writeBytes = function (data) {
    var len = data.length;
    var sublen = 32768;
    var offset = 0;
    while (true) {
        if (len <= sublen) {
            this.builder.appendUInt8(66);
            this.builder.appendUInt8(len >> 8);
            this.builder.appendUInt8(len);
            this.printBytes(data, offset, len);
            break;
        }
        this.builder.appendUInt8(98);
        this.builder.appendUInt8(len >> 8);
        this.builder.appendUInt8(len);
        this.printBytes(data, offset, sublen);
        len -= sublen;
        offset += sublen;
    }

    return this;
};

Output.prototype.printBytes = function (data, offset, len) {
    for (var i = 0; i < len; i++) {
        this.builder.appendUInt8(data[i + offset]);
    }
    return this;
};

/**
 * 返回builder
 */
Output.prototype.getBuffer = function () {
    return this.builder.get();
};

module.exports = Output;