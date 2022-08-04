Object.prototype.freeze = function () {
    const obj = this.valueOf();

    Object.freeze(obj);

    for (const subObj of (obj instanceof Array ? obj : Object.values(obj)))
        if (typeof(subObj) === "object")
            subObj.freeze()

    return obj;
}