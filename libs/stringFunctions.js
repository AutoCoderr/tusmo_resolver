String.prototype.some = function(callback) {
    const str = this.valueOf();
    if (str === "")
        return false;

    if (callback(str[0]))
        return true;

    return str.substring(1).some(callback);
}

String.prototype.count = function(callback, n = 0, i= 0) {
    const str = this.valueOf();
    if (i === str.length)
        return n;

    return str.count(callback, callback(str[i],i) ? n+1 : n, i+1);
}