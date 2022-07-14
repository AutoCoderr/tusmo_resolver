const initDb = require("./initDb");
const express = require("express");
const cors = require("cors");
const validate = require("./validate");
const findWord = require("./findWord");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/", (req, res) => {
    if (!validate(req.body))
        return res.sendStatus(400);

    findWord(req.body)
        .then(word => res.json(word));
})

app.listen(process.env.PORT ?? 3000)

initDb().then(() => {
    console.log("database initialisation finished");
})