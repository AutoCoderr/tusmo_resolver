require("./stringFunctions");

const charsToAvoid = [" ","-"];

module.exports = function validFormattedWord(formattedWord) {
    return !formattedWord.some(letter => charsToAvoid.includes(letter))
}