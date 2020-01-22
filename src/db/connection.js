const inMemoryDB = require("./db");

let db;

module.exports = {
    client: async () => {
        if (!db) {
            db = inMemoryDB();
        }

        return new Promise(resolve => {
            resolve(db);
        });
    }
};
