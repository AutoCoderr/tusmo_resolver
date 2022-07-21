function getWordMeta() {
	const tab = getTab();

	const nbLevelsStr = tab.style.gridTemplateRows[7];
	if (parseInt(nbLevelsStr).toString() !== nbLevelsStr || nbLevelsStr === 'NaN')
		throw new Error("Impossible de récupérer le nombre de tentatives");

	const lenWordStr = tab.style.gridTemplateColumns[7];
	if (parseInt(lenWordStr).toString() !== lenWordStr || lenWordStr === 'NaN')
		throw new Error("Impossible de récupérer la longueur du mot");

	const [nbLevels, lenWord] = [nbLevelsStr, lenWordStr].map(n => parseInt(n));

	return {nbLevels: getRealNbLevels(tab,lenWord, nbLevels), lenWord};
}

function getRealNbLevels(tab, lenWord, nbLevels, cells = getCells(tab)) {
	if (nbLevels === 1)
		return nbLevels;

	const firstLevelCell = cells[(nbLevels-1)*lenWord]
	if (firstLevelCell === undefined)
		throw new Error("Can't get the first cell of level '"+(nbLevels-1)+"'");
	const {type} = getCellTypeAndLetter(firstLevelCell)
	if (!["beginning", undefined].includes(type))
		return nbLevels

	return getRealNbLevels(tab, lenWord, nbLevels-1, cells);
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
	const tab = document.querySelector(".game-column .motus-grid");
	if (tab === undefined)
		throw new Error("Tableau tusmo introuvable");
	return tab;
}

function getCells(tab) {
	return tab.getElementsByClassName('grid-cell');
}

function getCellsByRange(cells, a, b, chooseCells = [], i = a) {
	if (i === b)
		return chooseCells;

	if (cells[i] === undefined)
		throw new Error("Cellule '"+i+"' introuvable")

	return getCellsByRange(cells, a, b, [...chooseCells, cells[i]], i+1);
}
