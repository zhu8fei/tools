/**
 * Created by Wang Pengfei on 2016/9/27.
 */
var assert = require('assert'),
    BufferReader = require('buffer-reader'),
    Long = require('long');


function Input() {
    this.reader = new BufferReader(new Buffer(0));
}
Input.prototype.readRPCMessage = function(data){

    return this;
}
Input.prototype.call = function (data) {
    
    
    return this;
}
Input.prototype.startCall = function (data) {

    return this;
}
Input.prototype.endCall = function (data) {
    this.builder.appendUInt8(122);
    return this;
}


Input.prototype.readHead = function (data) {

    return this;
}

Input.prototype.read = function (data) {

    return this;
}

Input.prototype.readObject = function (data) {

    return this;
}

Input.prototype.readListBegin = function (data) {

    return this;
}
Input.prototype.readListEnd = function (data) {

    return this;
}

Input.prototype.readMapBegin = function (data) {

    return this;
}
Input.prototype.readMapEnd = function (data) {

    return this;
}
Input.prototype.readBoolean = function (data) {

    return this;
}
Input.prototype.readInt = function (data) {

    return this;
}
Input.prototype.readLong = function (data) {

    return this;
}
Input.prototype.readDouble = function (data) {

    return this;
}
Input.prototype.readUTCDate = function (data) {

    return this;
}
Input.prototype.readNull = function (data) {

    return this;
}
Input.prototype.readString = function (data) {

    return this;
}
Input.prototype.readBytes = function (data) {

    return this;
}

/**
 * 返回builder
 */
Input.prototype.getData = function () {
    return {};
};
module.exports = Input;