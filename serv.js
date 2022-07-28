const express = require("express");
const cors = require("cors");
const validate = require("./validate");
const findWordsAndGetEntropies = require("./libs/findWordsAndGetEntropies");

require("./libs/listCombinasonsWordMask");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname+"/public"));
app.use("/js", express.static(__dirname+"/libs/public"));

app.post("/", (req, res) => {
    if (!validate(req.body))
        return res.sendStatus(400);

    findWordsAndGetEntropies(req.body)
        .then(words => res.json(words));
})

app.listen(process.env.PORT ?? 3000, () => {
    console.log("Server listening");
})
