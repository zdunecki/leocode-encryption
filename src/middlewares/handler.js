const jwt = require("jsonwebtoken");

const {
    InvalidToken,
    ExpiredToken,
    EmptyToken,
    TokenError
} = require("../../api/errors/auth");
const {UnexpectedError} = require("../../api/errors/common");

const responseError = ({error} = {}) => {
    delete error.statusCode;

    return {error};
};

const getTokenFromRequest = req =>
    (req.cookies && req.cookies.token) ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]) ||
    req.token ||
    req.query.token ||
    req.headers.token ||
    req.headers.authorization;
null;

const throwErr = req => {
    let errorType = UnexpectedError({
        requestId: req.id
    });

    delete errorType.error.statusCode;

    return errorType;
};

const handler = (logic, options = {}) => async (req, reply) => {
    try {
        if (req.method === "OPTIONS") {
            reply.code(201);
            return reply.res.end();
        }

        const [response, err] = await logic(req);

        if (err) {
            reply.code(err.error.statusCode || 500);

            delete err.error.statusCode;

            return err;
        }

        if (!options.reply) {
            return {response};
        }

        if (options.reply.type) {
            reply.type("application/pdf");

            reply.send(response);

            return
        }

        if (options.reply.serialization) {
            return options.reply.serialization(reply, response)
        }

    } catch (e) {
        const msg = throwErr(req);

        req.log.error(e);
        reply.code(500);

        return msg;
    }
};

module.exports = {
    handler,
    protectedHandler: ({
                           handlerOptions = {}
                       } = {}) => logic => async (req, reply) => {
        if (req.method === "OPTIONS") {
            reply.code(201);
            return reply.res.end();
        }

        const tokenSecret = process.env.JWT_SECRET;

        const token = getTokenFromRequest(req);

        const unauthorized = (err, details) => {
            reply.code(401);

            return responseError(err(details));
        };

        if (!token) {
            return unauthorized(EmptyToken);
        }

        try {
            const response = new Promise(async (resolve, reject) => {
                return jwt.verify(token, tokenSecret, async (err, userToken) => {
                    if (err) {
                        if (err instanceof jwt.TokenExpiredError) {
                            return resolve(unauthorized(ExpiredToken));
                        } else if (err instanceof jwt.JsonWebTokenError) {
                            return resolve(
                                unauthorized(TokenError, {message: err.message})
                            );
                        }

                        return reject(err);
                    }

                    if (userToken.error) {
                        return resolve(unauthorized(InvalidToken));
                    }

                    req.user = {
                        id: userToken.id,
                        email: userToken.email
                    };

                    req.token = token;

                    const response = await handler(logic, handlerOptions)(req, reply);

                    return resolve(response);
                });
            });

            return response;
        } catch (e) {
            const msg = throwErr(req);

            req.log.error(e);
            reply.code(500);

            return msg;
        }
    }
};
