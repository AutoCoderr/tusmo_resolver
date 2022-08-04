const fs = require("fs/promises");
const {formatWord} = require("./libs/format");
const {getWordModel, getAllWordModels} = require("./models/Word");
require("./libs/objectFunctions");
require("./libs/stringFunctions");

function getExtFile(filename) {
    const splittedFilename = filename.split(".");
    return splittedFilename[splittedFilename.length-1];
}

function accumulate() {
    return process.argv[2] === "accumulate";
}

async function getExistingNbUseByLen() {
    console.log("\nGetting total word count by length ...");
    const models = await getAllWordModels();
    const totalWordCountByLen = {};
    for (let i=0;i<models.length;i++) {
        console.log("Model "+(i+1)+"/"+models.length);
        const model = models[i];
        const words = await model.find();
        console.log(words.length+" words found");
        totalWordCountByLen[words[0].word.length] = words.reduce((acc,{nbUse}) => acc+(nbUse??0), 0)
    }
    return totalWordCountByLen.freeze();
}

async function getNbUseByWordAndLen(initNnbUseByLen) {
    const textSourcesDir = "text_sources/";
    const filenames = await fs.readdir(__dirname+"/"+textSourcesDir).then(files => files.filter(filename => getExtFile(filename) === "txt"));

    const nbUseByLen = { ...initNnbUseByLen };
    const nbUseByWord = {};
    let i = 0;
    for (const filename of filenames) {
        console.log("Fichier '"+filename+"' "+i+"/"+filenames.length);
        const text = await fs.readFile(__dirname+"/"+textSourcesDir+filename).then(chunk => chunk.toString());
        const words = text.splitMulti([" ","'",'"',"-","\n","\r","\f",",",";",".","!","?","»","«","’","(",")","…"])
        for (const word of words) {
            if (new RegExp("\\d+").test(word) || word === '')
                continue;
            const formattedWord = formatWord(word);

            nbUseByLen[formattedWord.length] = (nbUseByLen[formattedWord.length]??0)+1;
            nbUseByWord[formattedWord] = (nbUseByWord[formattedWord]??0)+1;
        }
        i++;
    }

    return {nbUseByLen,nbUseByWord}.freeze();
}

async function initDbFromTextSources() {
    const {nbUseByLen,nbUseByWord} = await getNbUseByWordAndLen(accumulate() ? await getExistingNbUseByLen() : {})

    console.log("\nSorting words by frequencie")
    const sortedNbUseByWord = Object.entries(nbUseByWord)
        .sort(([,n1],[,n2]) => n2-n1);

    console.log("Saving words frequency ...");
    let i = 0;
    for (const [word,nbUse] of sortedNbUseByWord) {
        if (i % Math.floor(sortedNbUseByWord.length/50) === 0)
            console.log("Saving "+Math.round(i/sortedNbUseByWord.length*50)*2+"%")
        const Word = await getWordModel(word.length);
        const wordObj = await Word.findOne({word})
            .then(wordObj => wordObj ?? Word.create({
                word
            }))
        wordObj.nbUse = accumulate() ? (wordObj.nbUse??0)+nbUse : nbUse;
        wordObj.percentUse = nbUseByLen[word.length] > 0 ? wordObj.nbUse/nbUseByLen[word.length]*100 : 0;
        await wordObj.save();
        i ++;
    }
    process.exit();
}

initDbFromTextSources();