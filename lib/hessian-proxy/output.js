/**
 * Created by Wang Pengfei on 2016/9/27.
 */
var assert = require('assert'),
    BufferReader = require('buffer-reader'),
    Long = require('long');


function Output(initial) {
    this.reader = new BufferReader(new Buffer(0));
    this.classDefs = {};
    this.typeRefs = {};
    this.valueRefs = [];
}

Output.prototype.call = function (data) {
    
    
    return this;
}
Output.prototype.startCall = function (data) {

    return this;
}
Output.prototype.endCall = function (data) {
    this.builder.appendUInt8(122);
    return this;
}


Output.prototype.readHead = function (data) {

    return this;
}

Output.prototype.read = function (data) {

    return this;
}

Output.prototype.readObject = function (data) {

    return this;
}

Output.prototype.readListBegin = function (data) {

    return this;
}
Output.prototype.readListEnd = function (data) {

    return this;
}

Output.prototype.readMapBegin = function (data) {

    return this;
}
Output.prototype.readMapEnd = function (data) {

    return this;
}
Output.prototype.readBoolean = function (data) {

    return this;
}
Output.prototype.readInt = function (data) {

    return this;
}
Output.prototype.readLong = function (data) {

    return this;
}
Output.prototype.readDouble = function (data) {

    return this;
}
Output.prototype.readUTCDate = function (data) {

    return this;
}
Output.prototype.readNull = function (data) {

    return this;
}
Output.prototype.readString = function (data) {

    return this;
}
Output.prototype.readBytes = function (data) {

    return this;
}

module.exports = Output;