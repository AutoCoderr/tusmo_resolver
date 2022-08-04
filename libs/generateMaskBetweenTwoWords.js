require("./public/numberFunctions");

String.prototype.findWithIndex = function(callback, i= 0) {
	const str = this.valueOf();
	if (i === str.length)
		return false;

	if (callback(str[i],i))
		return i;

	return this.findWithIndex(callback, i+1)
}

function generateMaskBetweenTwoWords(enteredWord,inDBWord) {
	const placeds = {}, badPlaceds = {}, absents = {}, indexesByYellowLetter = {}
	for (let i=0;i<enteredWord.length;i++) {
		if (enteredWord[i] === inDBWord[i]) {
			placeds[i] = enteredWord[i];
			continue;
		}
		const otherLetterIndexFound = inDBWord.findWithIndex((c,j) => c === enteredWord[i] && c !== enteredWord[j] && !(indexesByYellowLetter[c]??[]).includes(j))
		if (otherLetterIndexFound !== false) {
			badPlaceds[i] = enteredWord[i];
			continue;
		}
		absents[enteredWord[i]] = true;
	}

	return {
		placeds,
		badPlaceds,
		absents: Object.keys(absents).sort()
	}
}

module.exports = generateMaskBetweenTwoWords;