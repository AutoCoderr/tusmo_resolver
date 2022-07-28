function getAllAbsents(levels) {
	return levels.reduce((acc, {absents, badPlaceds}) => [
		...acc,
		...absents.filter(letter => !Object.values(badPlaceds).includes(letter))
	], []);
}

function getAllPlaceds(levels) {
	return levels.reduce((acc, {placeds}) => ({
		...acc,
		...placeds
	}), {});
}

function getAllBadPlaceds(levels) {
	return levels.reduce((acc, {badPlaceds}) => ({
		...acc,
		...Object.entries(badPlaceds).reduce((acc, [key, letter]) => ({
			...acc,
			[key]: acc[key] ? [...acc[key], letter] : [letter]
		}), acc)
	}), {});
}

module.exports = {getAllAbsents, getAllPlaceds, getAllBadPlaceds};
