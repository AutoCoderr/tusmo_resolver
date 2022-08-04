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