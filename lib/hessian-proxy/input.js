/**
 * Created by Wang Pengfei on 2016/9/27.
 */
var assert = require('assert'),
    Long = require('long');


function Input() {
    this.data = {};
    this.next = 0;
};

Input.prototype.call = function (result) {

    console.info("input size " + result.length);

    this.start(result);
    this.data.heads = this.readHeads(result);
    this.data.result = this.readBody(result);
    return this.data;
};


Input.prototype.start = function (result) {
    this.next += 3;
    if (result[0] != 114) {
        throw new Error("返回信息不正确.");
    }
    return this.data;
};
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

Input.prototype.readBody = function (result) {
    this.next++;
    var key = result[this.next];
    if (key == 102) {
        return this.readError(result);
    }

    return this.data;
};

Input.prototype.readError = function (result) {
    this.next++;


    return this.data;
};

Input.prototype.read = function (result) {
    this.next++;
    var key = result[this.next];
    switch (key) {
        case 78:
            return this.readNull(result);
        case 83:
        case 115:
            return this.readString(result);
        default:
            break;
    }

    return this.data;
};
Input.prototype.readString = function (result, more) {
    var word = '';
    if (more) {
        word += more;
    }
    var key = result[this.next - 1];
    if (key == 83) {
        var len = result[this.next] + result[this.next++];
        var byte = [];
        for (var i = 0; len > i; i++ , this.next++) {
            byte[i] = result[this.next];
        }
        word += new Buffer(byte).toString();
        return word;
    } else if (key == 115) {
        var len = result[this.next] + result[this.next++];
        var byte = [];
        for (var i = 0; len > i; i++ , this.next++) {
            byte[i] = result[this.next];
        }
        word += new Buffer(byte).toString();
        this.next++;
        return this.readString(result, word);
    }
    return null;
};
Input.prototype.readNull = function (result) {
    return null;
};
Input.prototype.readObject = function (result) {


    return this.data;
};
module.exports = Input;