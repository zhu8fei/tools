/**
 * Created by zhu8fei on 16/10/2.
 */
/**
 * 通常需要写入companyId.
 */
var Long = require('long');
function Head(id) {
    this.heads = [{"head": {"name": "reqCompanyId", "__type__": "String", "data": id}},
        {"head": {"name": "invokeTime", "__type__": "UTCDate", "data": new Date}}

    ]
}
/**
 * head {"head": {"name": "name", "__type__": "type", "data":"data"}}
 * @param obj
 */
Head.prototype.push = function (obj) {
    this.heads[this.heads.length] = obj;
}
/**
 *
 * @param name
 * @param type
 * @param data
 */
Head.prototype.push = function (name, type, data) {
    this.heads[this.heads.length] = {"head": {"name": name, "__type__": type, "data": data}};
}

module.exports = Head;
