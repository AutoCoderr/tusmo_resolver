String.prototype.some = function(callback) {
    const str = this.valueOf();
    if (str === "")
        return false;

    if (callback(str[0]))
        return true;

    return str.substring(1).some(callback);
}