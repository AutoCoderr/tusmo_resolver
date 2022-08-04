const express = require("express");
const cors = require("cors");
const validateRequest = require("./libs/validateRequest");
const findWords = require("./libs/findWords");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname+"/public"));
app.use("/js", express.static(__dirname+"/libs/public"));

app.post("/", (req, res) => {
    if (!validateRequest(req.body))
        return res.sendStatus(400);

    findWords(req.body)
        .then(words => res.json(words));
})

app.listen(process.env.PORT ?? 3000, () => {
    console.log("Server listening");
})
