const Word = require("./models/Word");
require("./public/libs");

/*const t = {
    len: 9,
    levels: [
        {
            placeds: {
                0: 'L',
                1: 'A',
            },
            badPlaceds: {
                5: 'E',
                6: 'R'
            },
            absents: ['I','T','E','S']
        },
        {
            placeds: {
                0: 'L',
                1: 'A',
            },
            badPlaceds: {
                5: 'U',

                7: 'E'
            },
            absents: ['D']
        }
    ]
}*/

function generateRegex({len,levels}) {
    const allAbsents = levels.reduce((acc,{absents, badPlaceds}) => [
        ...acc,
        ...absents.filter(letter => !Object.values(badPlaceds).includes(letter))
    ], []);

    const allPlaceds = levels.reduce((acc,{placeds}) => ({
        ...acc,
        ...placeds
    }), {})

    const allBadPlaceds = levels.reduce((acc,{badPlaceds}) => ({
        ...acc,
        ...Object.entries(badPlaceds).reduce((acc, [key, letter]) => ({
            ...acc,
            [key]: acc[key] ? [...acc[key], letter] : [letter]
        }), acc)
    }), {});

    return "^"+len.reduce((regex, i) =>
        regex + (
            allPlaceds[i] ?
                allPlaceds[i] :
                allBadPlaceds[i] ?
                    "[^" + [...allAbsents, ...allBadPlaceds[i]].join("") + "]" :
                    allAbsents.length > 1 ?
                        "[^" + allAbsents.join("") + "]" :
                        "."
        ), "")+"$"
}

module.exports = function findWord({len,levels}) {
    return Word.find({
        formattedWord: { $regex: generateRegex({len,levels}) }
    }).then(words => {
        const computedBadPlacedsByLevel = levels.map(({badPlaceds}) =>
            Object.entries(badPlaceds).reduce((acc,[index,letter]) => ({
                ...acc,
                [letter]: acc[letter] ? [...acc[letter], parseInt(index)] : [parseInt(index)]
            }), {})
        );
        const inAbsentBadPlacedLetterByLevel = levels.map(({absents}, i) =>
            Object.keys(computedBadPlacedsByLevel[i]).reduce((acc,letter) => ({
                ...acc,
                [letter]: absents.includes(letter)
            }), {})
        )
        const unknownIndexesByLevel = levels.map(({placeds}) =>
            len.filter(i => placeds[i] === undefined)
        );

        return words.filter(word =>
            !levels.some(({absents}, i) => {
                const computedBadPlaceds = computedBadPlacedsByLevel[i];
                const unknownIndexes = unknownIndexesByLevel[i];

                return Object.entries(computedBadPlaceds).some(([letter,indexes]) => {
                    const nbAppear = unknownIndexes.filter(index => !indexes.includes(index) && word.formattedWord[index] === letter).length
                    return (
                        nbAppear < indexes.length ||
                        (inAbsentBadPlacedLetterByLevel[i][letter] && nbAppear > indexes.length) ||
                        (!inAbsentBadPlacedLetterByLevel[i][letter] && nbAppear > absents.length)
                    )
                })
            })
        )
    })
}
