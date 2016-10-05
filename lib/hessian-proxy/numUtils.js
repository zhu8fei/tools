/**
 * Created by zhu8fei on 16/10/2.
 */

function NumUtils (){
    
}

NumUtils.prototype.isInt=function (data) {
    return typeof data === 'number' && parseFloat(data) === parseInt(data, 10) && !isNaN(data);
}

NumUtils.prototype.isFloat=function(data) {
    return typeof data === 'number' && parseFloat(data) !== parseInt(data, 10) && !isNaN(data);
}

NumUtils.prototype.cap=function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

NumUtils.prototype.startWitch=function(data,str){
    var tmp = data.substr(0,str.length);
    return tmp == str;
}

module.exports = NumUtils;

