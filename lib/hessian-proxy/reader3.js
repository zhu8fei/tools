var Input = require('./input');


function Reader() {
   this.input = new Input();
}

Reader.prototype.readRPCMessage = function() {
    return this.input;
};

module.exports = Reader;
