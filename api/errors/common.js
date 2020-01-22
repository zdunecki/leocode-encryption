const {ApiError} = require("./index");

module.exports = {
    NotFound: ({entity = "Entity"} = {}) =>
        ApiError({
            type: "NotFound",
            statusCode: 400,
            message: `${entity} not found`
        }),
    UnexpectedError: details =>
        ApiError({
            type: "UnexpectedError",
            statusCode: 500,
            message: `Something went wrong`,
            details
        })
};
