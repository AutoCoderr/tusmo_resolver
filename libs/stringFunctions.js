String.prototype.some = function(callback, i = 0) {
    const str = this.valueOf();
    if (i === str.length)
        return false;

    if (callback(str[i],i))
        return true;

    return str.some(callback, i+1);
}

String.prototype.count = function(callback, n = 0, i= 0) {
    const str = this.valueOf();
    if (i === str.length)
        return n;

    return str.count(callback, callback(str[i],i) ? n+1 : n, i+1);
}

String.prototype.splitMulti = function(delimiters) {
    const delimitersList = delimiters instanceof Array ? delimiters : [delimiters];
    const str = this.valueOf();
    if (delimitersList.length === 0) {
        return [str];
    }
    const newDelimitersList = delimitersList.slice(1);
    const splittedStr = str.split(delimitersList[0]);
    const out = [];
    for (const subStr of splittedStr) {
        for (const subStr2 of subStr.splitMulti(newDelimitersList)) {
            out.push(subStr2);
        }
    }
    return out.freeze();
}

