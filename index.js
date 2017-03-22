var randomNumber = require('./random/number');
var randomString = require('./random/string');
var randomNull = require('./random/null');
var randomBoolean = require('./random/boolean');
var randomArray = require('./random/array');

// json type
var typeJson = ['number', 'string', 'null', 'boolean', 'array', 'object'];
// custom type
var customType = ['chinese', 'float', 'image', 'url', 'email', 'date', 'tel'];
// Syntax Character
// var syntaxCharacter = ['*', '+', '?', '[', ']', ',', '{@', '{', '}', '|', '-'];
var syntaxCharacter = ['\\*', '\\+', '\\?', '\\[', '\\]', ',', '{@', '\\{', '\\}', '\\|', '\\-'];

var typeKeys = typeJson.concat(customType);
// syntaxKeys
var syntaxKeys = typeJson.concat(customType);
// or regexp
var orTxtReg = /\|/;
// Quantifier regexp
var quanReg = /(\{(\d+)(,(\d*))?\})?/;
// keyReg
var keyReg = new RegExp('(' + typeKeys.join('|') + ')(?:\\{(\d+)(,(\d*))?\\})?');
// optionalReg
var optionalReg = new RegExp('(' + '\\[(.*?)\\]' + ')(?:\\{(\d+)(,(\d*))?\\})?');
// array Quantifier regexp
var arrQuanReg = /^(.*)\{@(?:\{(\d+)(,(\d*))?\})?\}/;

var randomJson = {};
var syntaxSignReg = /\{@(.*)}/;
// loop json
function main(modelJson) {
    readObject('', modelJson, randomJson);
    return randomJson;
}
// read object
function readObject(pro, obj, upperObj) {
    for (var p in obj) {
        if (getJsonType(obj[p]) === 'array') {
            var syntaxMatch = p.match(arrQuanReg);
            var proStr = '';
            if (syntaxMatch !== null) {
                proStr = syntaxMatch[1];
            }
            else {
                proStr = p;
            }
            upperObj[proStr] = [];
            readArray(p, obj[p], upperObj[proStr]);
        }
        else if (getJsonType(obj[p]) === 'object') {
            upperObj[p] = {};
            readObject(p, obj[p], upperObj[p]);
        }
        else {
            parseCharactor(p, obj[p], upperObj);
        }
    }
}
// read array
function readArray(key, arr, upperObj) {
    var syntaxMatch = key.match(arrQuanReg);
    if (syntaxMatch !== null) {
        arr = randomArray(arr, syntaxMatch[2], syntaxMatch[3], syntaxMatch[4]);
        console.log(arr);
    }
    arr.forEach(function (item, index) {
        if (getJsonType(item) === 'object') {
            upperObj[index] = {};
            console.log(upperObj[index]);
            readObject(index, item, upperObj[index]);
        }
        else if (getJsonType(item) === 'array') {
            readArray(index, item, upperObj[index]);
        }
        else {
            parseCharactor(index, item, upperObj);
        }
    });
}
// parse charactors
function parseCharactor(keyCha, valueCha, upperObj) {
    if (getJsonType(valueCha) === 'null' || getJsonType(valueCha) === 'number' || getJsonType(valueCha) === 'boolean') {
        upperObj[keyCha] = valueCha;
        return;
    }
    var syntaxMatch = valueCha.match(syntaxSignReg);
    var synTxt= '';
    if (syntaxMatch !== null) {
        synTxt = syntaxMatch[1];
        upperObj[keyCha] = handleTxt(synTxt);
    }
    else {
        upperObj[keyCha] = valueCha;
    }
}
function handleTxt(synTxt) {
    if (orTxtReg.test(synTxt)) {
        orTxt(synTxt);
    }
    else {
        var keyRes = synTxt.match(keyReg);
        var optionalRes = synTxt.match(optionalReg);
        if (keyRes !== null) {
            return randomByType(synTxt, keyRes[1], keyRes[2], keyRes[3], keyRes[4]);
        }
    }
}
function getTxtByKey(keyType, fNumber, sNumber, tNumber) {

}
// or txt
function orTxt(synTxt) {

}
function randomByType(synTxt, keyType, fNumber, sNumber, tNumber) {
    if (keyType === 'number') {
        return randomNumber(fNumber, sNumber, tNumber);
    }
    else if (keyType === 'string') {
        return randomString(fNumber, sNumber, tNumber);
    }
    else if (keyType === 'boolean') {
        return randomBoolean();
    }
    else if (keyType === 'null') {
        return randomNull();
    }
    else {
        return synTxt;
    }
}
// get json type
function getJsonType(arg1) {
    if (arg1 === null) {
        return 'null';
    }
    else if (typeof arg1 === 'string') {
        return 'string';
    }
    else if (typeof arg1 === 'number') {
        return 'number';
    }
    else if (typeof arg1 === 'boolean') {
        return 'boolean';
    }
    else if (Object.prototype.toString.call(arg1) === '[object Array]') {
        return 'array';
    }
    else if (Object.prototype.toString.call(arg1) === '[object Object]') {
        return 'object';
    }
    else {
        throw new Error('illegal type');
    } 
}

module.exports = main;