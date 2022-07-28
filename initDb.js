const fs = require("fs/promises");
const Word = require("./models/Word");
const formatColumns = require("./libs/formatColumns");
const validColumns = require("./libs/validColumns");

const file = "lexique.csv";

module.exports = async function initDb() {
    const nbWords = await Word.count();

    if (nbWords > 0)
        return
    console.log("Loading all words");
    return fs.readFile(__dirname+"/"+file)
        .then(chunk => chunk.toString().split("\n"))
        .then(lines => browseLines(lines,eachLine));
}

function eachLine({word}, i, total) {
    if ((i+1) % 1000 === 0 || i+1 === total)
        console.log((i+1)+"/"+total)

    if (word === '')
        return;

    return Word.create({
        formattedWord: word
    });
}

async function browseLines(lines, eachLine) {
    let acc = {};
    for (let i=0;i<lines.length;i++) {
        if (i === 0)
            continue;
        const columnsValues = formatColumns(getColumns(lines[i]));
        if (!validColumns(columnsValues))
            continue;
        const newAcc = toSkip(columnsValues,acc)
        if (newAcc === true)
            continue;
        acc = newAcc;

        await eachLine(columnsValues,i, lines.length);
    }
}

function getColumns(line) {
    const splittedLine = line.split(";");

    return ["word"].reduce((acc, key, index) => ({
        ...acc,
        [key]: splittedLine[index]
    }), {})
}

function toSkip({word}, {lastWord}) {
    if (word === lastWord) {
        return true;
    }
    return {lastWord: word};
}
