const {Schema} = require("mongoose");
const { connect } = require("../Mongo");

const db = connect();

const WordSchema = new Schema({
    word: { type: String, required: true },
    formattedWord: { type: String, required: true }
});


module.exports = db.model('Word', WordSchema);
