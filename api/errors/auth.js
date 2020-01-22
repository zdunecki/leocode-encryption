const {ApiError} = require("./index");

module.exports = {
    Unauthorized: () =>
        ApiError({
            type: "Unauthorized",
            statusCode: 401,
            message: "Unauthorized"
        }),
    InvalidToken: () =>
        ApiError({
            type: "InvalidToken",
            statusCode: 401,
            message: "Invalid user token"
        }),
    EmptyToken: () =>
        ApiError({
            type: "EmptyToken",
            statusCode: 401,
            message: "Empty token"
        }),
    ExpiredToken: () =>
        ApiError({
            type: "ExpiredToken",
            statusCode: 401,
            message: "Expired user token"
        }),
    TokenError: (details) =>
        ApiError({
            type: "TokenError",
            statusCode: 401,
            message: "Token error",
            details
        })
};
