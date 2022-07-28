const {Schema} = require("mongoose");
const { connect } = require("../Mongo");

const modelsByWordLen = {}

async function getWordModel(len) {
    if (modelsByWordLen[len])
        return modelsByWordLen[len];

    const db = await connect();

    const WordSchema = new Schema({
        word: { type: String, required: true }
    });

    modelsByWordLen[len] = db.model('Word_'+len, WordSchema);

    return modelsByWordLen[len];
}

function getLens() {
    return Object.keys(modelsByWordLen).map(parseInt);
}

module.exports = {getWordModel, getLens};
