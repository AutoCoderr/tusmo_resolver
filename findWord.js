const Word = require("./models/Word");

function generateRegex({len,positions,absents}) {
    const badPlacedLetters = Object.values(positions).reduce((acc,obj) => [
        ...acc,
        ...(typeof(obj) === "string" ? [] : obj.not)
    ], []);
    const allAbsents = absents.filter(letter => !badPlacedLetters.includes(letter));

    let regex = "";
    for (let i=0;i<len;i++) {
        regex += positions[i] ?
            typeof(positions[i]) === "string" ?
                positions[i] :
                "[^"+[...allAbsents, ...positions[i].not].join("")+"]" :
            allAbsents.length > 1 ?
                "[^"+allAbsents.join("")+"]" :
                "."
    }

    return "^"+regex+"$";
}

const rand = (a,b) => a+Math.floor(Math.random()*(b-a+1));

module.exports = async function findWord(obj) {
    const words = await Word.find({
        formattedWord: { $regex: generateRegex(obj) }
    });
    return words[rand(0,words.length-1)];
}