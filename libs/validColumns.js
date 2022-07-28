require("./stringFunctions");

const charsToAvoid = [" ","-","'"];

module.exports = function validColumns({word}) {
    return !word.some(letter => charsToAvoid.includes(letter))
}
