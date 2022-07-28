const mongoose = require("mongoose");

const {MONGO_INITDB_DATABASE, MONGO_HOST} = process.env;

let nbRetry = 0;
const nbRetryMax = 20;

let database;

const connect = () => {
    return new Promise(resolve => {
        if (database) {
            resolve(database);
            return;
        }

        if (nbRetry >= nbRetryMax) {
            throw new Error("Connexion impossible");
        } else if (nbRetry > 0) {
            console.log("Re try to connect")
        }

        const url = 'mongodb://' + MONGO_HOST + ':27017/' + MONGO_INITDB_DATABASE;

        mongoose.connect(url);

        database = mongoose;

        database.connection.once("open", () => {
            console.log("Connected to database");
            resolve(database);
        });

        database.connection.on("error", () => {
            console.log("Error connecting to database");
            database = undefined;
            nbRetry += 1;
            setTimeout(() => {
                resolve(connect());
            }, 250);
        });
    });
};

const disconnect = () => {
    if (!database) return;
    mongoose.disconnect();
    return mongoose;
};

module.exports = {connect, disconnect};
