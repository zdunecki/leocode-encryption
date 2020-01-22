const jwt = require("jsonwebtoken");

module.exports = {
    sign({data, expiresIn = "5min", secret = process.env.JWT_SECRET}) {
        return jwt.sign(data, secret, {expiresIn});
    },
    verify(token, secret = process.env.JWT_SECRET) {
        try {
            return jwt.verify(token, secret);
        } catch (err) {
            return {error: "Invalid token"};
        }
    }
};
