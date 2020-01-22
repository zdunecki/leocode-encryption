const defaultDB = {
    users: [
        {
            email: "example@mail.com",
            password: "$2b$10$jQcnewzDkkOF90BOApJHhOwqD2bRrywKLpZlfBiC9N/1fqTe5V2W2", // 1234
        },
        {
            email: "example2@mail.com",
            password: "$2b$10$jQcnewzDkkOF90BOApJHhOwqD2bRrywKLpZlfBiC9N/1fqTe5V2W2" // 1234
        },
    ]
};

module.exports = (DB = defaultDB) => ({
    collection: name => {
        const col = DB[name];

        const insertOne = async document => {
            return new Promise(resolve => {
                col.push(document);

                resolve(1);
            });
        };

        const findOne = async properties => {
            return new Promise(resolve => {
                resolve(
                    col.find(c =>
                        Object.keys(properties).every(key => c[key] === properties[key])
                    )
                );
            });
        };

        const find = async () => {
            return new Promise(resolve => {
                resolve(col);
            });
        };

        const findOneIndex = async properties => {
            return new Promise(resolve => {
                resolve(
                    col.findIndex(c =>
                        Object.keys(properties).every(key => c[key] === properties[key])
                    )
                );
            });
        };

        const updateOne = async (properties, document) => {
            const index = await findOneIndex(properties);

            col[index] = Object.assign({}, col[index], document);
        };

        return {
            find,
            findOne,
            insertOne,
            updateOne,
        };
    }
});
