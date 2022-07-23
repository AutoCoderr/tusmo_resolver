module.exports = function formatWord(word) {
    return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
}