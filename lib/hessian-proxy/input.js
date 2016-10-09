/**
 * Created by Wang Pengfei on 2016/9/27.
 */
var assert = require('assert'),
    BufferReader = require('buffer-reader'),
    Long = require('long');


function Input(data) {
    this.reader = new BufferReader(data);
    this.data = {};
    this._peek = -1;
    this._isLastChunk = false;
    this._chunkLength = 0;
    this._method;
};

Input.prototype.call = function (data) {
    if (data)
        this.reader = new BufferReader(data);

    this.startCall();

    var va = this.reader.nextUInt8();

    if (va == 102) {
        return this.prepareFault();
    } else {

    }

    return this.data;
};
Input.prototype.startCall = function (data) {
    if (data)
        this.reader = new BufferReader(data);

    var va = this.reader.nextUInt8();
    if (va != 114) {
        throw new Error("expected hessian reply at " + va);
    }
    // major
    this.reader.nextUInt8();
    // minor
    this.reader.nextUInt8();
    return this;
};


Input.prototype.read = function () {
    var ch;
    if (this._peek >= 0) {
        ch = this._peek;
        this._peek = -1;
        return ch;
    } else {
        ch = this.reader.nextUInt8();
        return ch;
    }
};
/**
 * 读取对象.   目前测试出有坑. 当输出对象为同一个时, 序列化也同样会是一个.猜测有多次标记引用. 不知道能不能识别出来.
 * @returns {*}
 */
Input.prototype.readObject = function () {
    var data = {};

    var tag = this.read();
    var type, type1;
    switch (tag) {
        case 66:
        case 98:
            this._isLastChunk = tag == 66;
            this._chunkLength = (this.read() << 8) + this.read();
            var byte = [], bsize = 0;
            while ((type1 = this.parseByte()) >= 0) {
                byte[bsize] = type1;
                bsize++;
            }
            return byte;
        case 67:
        case 69:
        case 71:
        case 72:
        case 74:
        case 75:
        case 79:
        case 80:
        case 81:
        case 85:
        case 87:
        case 89:
        case 90:
        case 91:
        case 92:
        case 93:
        case 94:
        case 95:
        case 96:
        case 97:
        case 99:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 116:
        case 117:
        case 118:
        case 119:
        default:
            throw this.error("unknown code for readObject at " + tag);
        case 68:
            return this.parseDouble();
        case 70:
            return this.reader.nextDoubleBE();
        case 73:
            return this.parseInt();
        case 76:
            return this.parseLong();
        case 77:
            type = this.readType();
            return this.readMap(this, type);
        case 78:
            return null;
        case 82:
            type1 = this.parseInt();
            return this._refs.get(type1);
        case 83:
        case 115:
            this._isLastChunk = tag == 83;
            this._chunkLength = (this.read() << 8) + this.read();
            return this.readString();
        case 84:
            return Boolean.valueOf(true);
        case 86:
            type = this.readType();
            // var url1 = this.readLength();
            // return this._serializerFactory.readList(this, url1, type);
        case 88:
        case 120:
            this._isLastChunk = tag == 88;
            this._chunkLength = (this.read() << 8) + this.read();
            // return this.parseXML();
        case 100:
            return new Date(this.parseLong());
        case 114:
            type = this.readType();
            String
            url = this.readString();
            // return this.resolveRemote(type, url);
    }

    return data;
};

Input.prototype.readMap = function () {
    var data;

    return data;
}

Input.prototype.prepareFault = function (data) {

};
Input.prototype.readFault = function () {
    var data = {};
    var code;
    for (code = this.read(); code > 0 && code != 122; code = this.read()) {
        this._peek = code;
        var key = this.readObject();
        var value = this.readObject();
        if (key != null && value != null) {
            data[key] = value;
        }
    }

    if (code != 122) {
        throw this.expect("fault", code);
    } else {
        return data;
    }
};

Input.prototype.parseByte = function () {
    while (this._chunkLength <= 0) {
        if (this._isLastChunk) {
            return -1;
        }

        var code = this.read();
        switch (code) {
            case 66:
                this._isLastChunk = true;
                this._chunkLength = (this.read() << 8) + this.read();
                break;
            case 98:
                this._isLastChunk = false;
                this._chunkLength = (this.read() << 8) + this.read();
                break;
            default:
                throw this.expect("byte[]", code);
        }
    }

    --this._chunkLength;
    return this.read();
};

Input.prototype.readType = function () {
    var len = this.reader.nextUInt16BE();
    return this.reader.nextString(len);
};


/*Input.prototype.readString = function () {
 var code = this.reader.nextUInt8();
 if (code >= 0 && code < 32) {
 return this.reader.nextString(code);
 } else if (code >= 0x30 && code <= 0x33) {
 this.reader.move(-1);
 var len = this.reader.nextUInt16BE() - 0x3000;
 return this.reader.nextString(len);
 } else if (code === 0x53) {
 var len = this.reader.nextUInt16BE();
 return this.reader.nextString(len);
 } else if (code === 0x52) {
 var len = this.reader.nextUInt16BE();
 return this.reader.nextString(len) + this.readString();
 }
 };*/
Input.prototype.readString = function () {
    var tag = this.read();
    switch (tag) {
        case 68:
            return String.valueOf(this.parseDouble());
        case 73:
            return String.valueOf(this.parseInt());
        case 76:
            return String.valueOf(this.parseLong());
        case 78:
            return null;
        case 83:
        case 88:
        case 115:
        case 120:
            this._isLastChunk = tag == 83 || tag == 88;
            this._chunkLength = (this.read() << 8) + this.read();
            var byte = [], bsize = 0, type1;
            while ((type1 = this.parseByte()) >= 0) {
                byte[bsize] = type1;
                bsize++;
            }
            return new Buffer(byte).toString('utf8');
        default:
            throw this.expect("string", tag);
    }
};
Input.prototype.parseDouble = function () {
    return this.reader.nextDoubleBE();
};
Input.prototype.parseInt = function () {
    assert(code === 0x49, "Expect 'I' but see: " + String.fromCharCode(code));
    return this.reader.nextInt32BE();
};
Input.prototype.parseLong = function () {
    var high = this.reader.nextInt32BE(),
        low = this.reader.nextInt32BE();
    return {
        high: high,
        low: low
    };
};

Input.prototype.expect = function (expect, ch) {
    return this.error("expected " + expect + " at " + ch);
};
Input.prototype.error = function (message) {
    return this._method != null ? new Error(this._method + ": " + message) : new Error(message);
};
module.exports = Input;