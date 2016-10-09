
var Long = require('long');


var what = {
    "saa" : "sd"

}
what.__type__ = "com.zhu8fei"

for(var a in what ){
    console.info(a)
}


console.info(new Date('2016-09-09 12:00:00').getTime())

var test =Long.fromInt(2);
console.info(test instanceof Long)
