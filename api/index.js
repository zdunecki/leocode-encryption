const authApplicationService = require("../src/application/services/auth");
const {Base64Encode} = require("base64-stream");
const {handler, protectedHandler} = require("../src/middlewares/handler");
const {getCurrentUser} = require("../src/application/middlewares/auth");
const {compose} = require("../src/utils/common");

const validation = {
    signIn: {
        schema: {
            body: {
                type: "object",
                required: ["email", "password"],
                maxProperties: 2,
                additionalProperties: false,
                properties: {
                    email: {format: "email", type: "string", minLength: 3},
                    password: {type: "string", minLength: 4}
                }
            }
        }
    },
    decrypt: {
        schema: {
            body: {
                type: "object",
                required: ["message"],
                maxProperties: 1,
                additionalProperties: false,
                properties: {
                    message: {type: "string"},
                }
            }
        }
    },
};

async function routes(fastify) {
    fastify.post(
        "/sign-in",
        validation.signIn,
        compose(
            handler,
        )(authApplicationService.signIn)
    );

    fastify.post(
        "/generate-key-pair",
        compose(
            protectedHandler(),
            getCurrentUser
        )(authApplicationService.generateKeyPair)
    );

    fastify.post(
        "/encrypt",
        compose(
            protectedHandler({
                handlerOptions: {
                    reply: {
                        serialization: (reply, response) =>
                            reply.type("text/html").send(
                                response
                                    .pipe(new Base64Encode())
                            )
                    }
                }
            }),
            getCurrentUser
        )(authApplicationService.encrypt)
    );

    fastify.post(
        "/decrypt",
        validation.decrypt,
        compose(
            protectedHandler({
                handlerOptions: {
                    reply: {
                        type: "application/pdf"
                    }
                },
            }),
            getCurrentUser
        )(authApplicationService.decrypt)
    );
}

module.exports = routes;
