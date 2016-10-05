/**
 * Created by zhu8fei on 16/10/2.
 */
/**
 * 通常需要写入companyId.
 */
var Long = require('long');
function Head(id) {
    this.heads = [{"head": {"name": "reqCompanyId", "__type__": "String", "data":id}},
        {"head": {"name": "invokeTime", "__type__": "UTCDate", "data": new Date}}

    ]
}

module.exports = Head;
