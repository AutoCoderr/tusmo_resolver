module.exports = function formatColumns({word}) {
    return {word: word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()}
}
