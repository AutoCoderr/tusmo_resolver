function formatWord(word) {
    return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/Œ/g,"oe").toUpperCase();
}

function formatColumns({word}) {
    return {word: formatWord(word)};
}

module.exports = {formatColumns, formatWord};
