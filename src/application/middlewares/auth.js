const conn = require("../../db/connection");
const {UserNotExists} = require("../../../api/errors/users");

module.exports = {
    getCurrentUser: logic => async (req) => {
        const db = await conn.client();

        const existingUser = await db
            .collection("users")
            .findOne({email: req.user.email});

        if (!existingUser) {
            return [null, UserNotExists()];
        }

        return logic(Object.assign({},
            req,
            {
                getCurrentUser: existingUser
            }
        ))
    },
};
