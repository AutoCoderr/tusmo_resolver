Number.prototype.reduce = function (callback,acc, i = 0) {
	const n = this.valueOf();
	if (i === n)
		return acc;

	return n.reduce(callback, callback(acc,i), i+1);
}
Number.prototype.filter = function(callback) {
	return this.valueOf().reduce((acc,i) => [
		...acc,
		...(callback(i) ? [i] : [])
	], [])
}

Number.prototype.map = function(callback) {
	return this.valueOf().reduce((acc,i) => [
		...acc,
		callback(i)
	], [])
}
Number.prototype.some = function(callback, i = 0) {
	const n = this.valueOf();
	if (i === n)
		return false;
	if (callback(i))
		return true;
	return n.some(callback,i+1);
}
