/**
 * Created by Wang Pengfei on 2016/9/27.
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

Output.prototype.call = function () {

}
Output.prototype.startCall = function () {

}
Output.prototype.endCall = function () {

}

Output.prototype.writeHead = function () {

}

Output.prototype.write = function () {

}

Output.prototype.writeObject = function () {

}

Output.prototype.writeListBegin = function (data) {

}
Output.prototype.writeListEnd = function (data) {

}
Output.prototype.writeMapBegin = function (data) {

}
Output.prototype.writeMapEnd = function (data) {

}
Output.prototype.writeBoolean = function (data) {

}
Output.prototype.writeInt = function (data) {

}
Output.prototype.writeLong = function (data) {

}
Output.prototype.writeDouble = function (data) {

}
Output.prototype.writeUTCDate = function (data) {

}
Output.prototype.writeNull = function (data) {

}
Output.prototype.writeString = function (data) {

}
Output.prototype.writeBytes = function (data) {

}

module.exports = Input;