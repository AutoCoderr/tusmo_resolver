const rand = require("./rand");

module.exports = function generatePlayerId(len = 26, str = "") {
	if (len === 0)
		return str;

	return generatePlayerId(len-1, str + rand(0,15).toString(16))
}
