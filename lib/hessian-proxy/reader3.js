var Input = require('./input');


function Reader() {
    this.input = new Input();
}

Reader.prototype.readRPCMessage = function (data) {
    console.info("reader3.js wait remove");
    console.info(JSON.stringify(data));
    this.data = this.input.call(data);
    return this;
};


/**
 * 返回builder
 */
Reader.prototype.getData = function () {
    return this.data;
};

module.exports = Reader;
