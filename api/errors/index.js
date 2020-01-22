module.exports = {
    ApiError: ({type, statusCode, message, details}) => {
        const props = {
            error: {
                type,
                statusCode,
                message
            }
        };

        if (details) {
            props.error.details = details;
        }

        return props;
    }
};
