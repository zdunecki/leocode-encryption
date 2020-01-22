const {NotFound} = require("./common");
const {ApiError} = require("./index");

module.exports = {
    UserExists: () =>
        ApiError({
            type: "UserExists",
            statusCode: 400,
            message: "User already exists"
        }),
    UserNotExists: () =>
        ApiError({
            type: "UserNotExists",
            statusCode: 400,
            message: "User not exists"
        }),
    WrongPassword: () =>
        ApiError({
            type: "WrongPassword",
            statusCode: 400,
            message: "Wrong user password"
        }),
    UserNotFound: () => NotFound({entity: "User"}),
    UserPublicKeyNotFound: () => NotFound({entity: "PublicKey"}),
    UserPrivateKeyNotFound: () => NotFound({entity: "PrivateKey"})
};
