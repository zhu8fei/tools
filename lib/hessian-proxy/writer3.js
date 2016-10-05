var Output = require('./output');
/**
 * 写方法
 * @constructor
 */
function Writer() {
    this.output = new Output(0);
}
/**
 * 实际调用input
 * @param method 方法描述 包括头信息
 * @param args 调用参数.数组类型.通常length = 1
 * @returns {Input|*} 返回类型,不要在意这个细节. 重点是proxy需要返回buffer
 */
Writer.prototype.writeCall = function (method, args) {
    this.output.call(method, args);
    return this.output;
};

module.exports = Writer;