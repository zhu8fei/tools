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
    
    
    
}
Output.prototype.startCall = function (data) {


}
Output.prototype.endCall = function (data) {
    this.builder.appendUInt8(122);
}


Output.prototype.readHead = function (data) {

}

Output.prototype.read = function (data) {

}

Output.prototype.readObject = function (data) {

}

Output.prototype.readListBegin = function (data) {

}
Output.prototype.readListEnd = function (data) {

}
Output.prototype.readMapBegin = function (data) {

}
Output.prototype.readMapEnd = function (data) {

}
Output.prototype.readBoolean = function (data) {

}
Output.prototype.readInt = function (data) {

}
Output.prototype.readLong = function (data) {

}
Output.prototype.readDouble = function (data) {

}
Output.prototype.readUTCDate = function (data) {

}
Output.prototype.readNull = function (data) {

}
Output.prototype.readString = function (data) {

}
Output.prototype.readBytes = function (data) {

}

module.exports = Output;