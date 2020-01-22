require("dotenv").config();

const conn = require("./src/db/connection");

(async () => {
    await conn.client();

    const fastify = require("fastify")({
        logger: true
    });

    fastify.register(require("./api"), {prefix: "/api"});

    fastify.listen(3000);
})();
