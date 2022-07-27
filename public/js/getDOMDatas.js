function getWordMeta() {
    const tab = getTab();

    const totalNbLevelsStr = tab.style.gridTemplateRows[7];
    if (parseInt(totalNbLevelsStr).toString() !== totalNbLevelsStr || totalNbLevelsStr === 'NaN')
        throw new Error("Impossible de récupérer le nombre de tentatives");

    const lenWordStr = tab.style.gridTemplateColumns[7];
    if (parseInt(lenWordStr).toString() !== lenWordStr || lenWordStr === 'NaN')
        throw new Error("Impossible de récupérer la longueur du mot");

    const [totalNbLevels, lenWord] = [totalNbLevelsStr, lenWordStr].map(n => parseInt(n));

    const realNbLevels = getRealNbLevels(tab, lenWord, totalNbLevels);

    return {nbLevels: realNbLevels > 1 ? realNbLevels-1 : realNbLevels, realNbLevels, lenWord};
}

function getRealNbLevels(tab, lenWord, nbLevels, cells = getCells(tab)) {
    if (nbLevels === 1)
        return nbLevels;

    const firstLevelCell = cells[(nbLevels - 1) * lenWord]
    if (firstLevelCell === undefined)
        throw new Error("Can't get the first cell of level '" + (nbLevels - 1) + "'");
    const {type} = getCellTypeAndLetter(firstLevelCell)
    if (type !== undefined)
        return nbLevels

    return getRealNbLevels(tab, lenWord, nbLevels - 1, cells);
}

function getCellTypeAndLetter(cell) {
    const contentDiv = cell.getElementsByClassName("cell-content")[0];
    if (contentDiv === undefined)
        throw new Error("Can't find content div letter");

    const colorClass = contentDiv.classList.item(1);

    return {
        letter: contentDiv.innerText,
        type: {
            "bg-sky-600": "beginning",
            r: "placed",
            "-": "absent",
            y: "badPlaced"
        }[colorClass]
    }
}


function getTab() {
    return document.querySelector(".game-column .motus-grid");
}

function getCells(tab) {
    return tab.getElementsByClassName('grid-cell');
}

function getCellsByRange(cells, a, b, chooseCells = [], i = a) {
    if (i === b)
        return chooseCells;

    if (cells[i] === undefined)
        throw new Error("Cellule '" + i + "' introuvable")

    return getCellsByRange(cells, a, b, [...chooseCells, cells[i]], i + 1);
}

function getKeyboard() {
    return document.querySelector(".keyboard");
}

function getKeys(keys = document.getElementsByClassName("key"), out = [], i = 0) {
    if (keys[i] === undefined)
        return out;

    const span = keys[i].querySelector("span");
    const iTag = keys[i].querySelector("i");

    const key = span ?
        span.innerText :
        iTag.classList.item(1) === "fa-sign-in-alt" ?
            "ENTER" :
            "BACKSPACE"

    return getKeys(
        keys,
        [
            ...out,
            {
                node: keys[i],
                key
            }
        ],
        i + 1
    )
}

function getNbFoundWords() {
    const div = document.querySelector(".game-header .flex");
    return div ? parseInt(div.getElementsByTagName("div")[1].innerText) : null;
}

function canPlayTusmo() {
    return getTab() !== null && getKeyboard() !== null;
}
