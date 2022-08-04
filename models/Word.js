const {Schema} = require("mongoose");
const { connect } = require("../Mongo");

const modelsByWordLen = {};

const IndexAndLetterSchema = new Schema({
    index: Number,
    letter: String
})

const CombinaisonScema = new Schema({
    hash: String,
    placeds: [IndexAndLetterSchema],
    badPlaceds: [IndexAndLetterSchema],
    absents: [String],
    nbWords: Number,
    words: [String]
});

async function getWordModel(len) {
    if (modelsByWordLen[len])
        return modelsByWordLen[len];

    const db = await connect();

    const WordSchema = new Schema({
        word: { type: String, required: true },
        percentUse: { type: Number, required: false },
        nbUse: { type: Number, required: false },
        combinaisons: [CombinaisonScema]
    });

    modelsByWordLen[len] = db.model('Word_'+len, WordSchema);

    return modelsByWordLen[len];
}

async function getAllWordModels() {
    const db = await connect().then(mongoose => mongoose.connection.db);

    return db.listCollections().toArray()
        .then(collections => collections.filter(({name}) => new RegExp("^word\\_[0-9]{1,2}$").test(name)))
        .then(collections => Promise.all(
            collections.map(({name}) => getWordModel(name.split("_")[1] ))
        ))
}

module.exports = {getWordModel, getAllWordModels};
