const jwt = require("jsonwebtoken");

const {UserNotExists} = require("../api/errors/users");
const inMemoryDB = require("../src/db/db");
const conn = require("../src/db/connection");
const authApplicationService = require("../src/application/services/auth");

const mockDB = {
    users: [
        {
            email: "test@mail.com",
            password: "$2b$10$jQcnewzDkkOF90BOApJHhOwqD2bRrywKLpZlfBiC9N/1fqTe5V2W2"
        }
    ]
};

beforeEach(() => {
    conn.client = jest.fn(() => new Promise((resolve) => {
        resolve(inMemoryDB(mockDB))
    }));

    process.env = Object.assign(process.env, {JWT_SECRET: "secret"});
});

test("Sign in", async () => {
    const body = {
        email: "test@mail.com",
        password: "1234"
    };

    const [response] = await authApplicationService.signIn({body});

    const decoded = jwt.verify(response.authToken, process.env.JWT_SECRET);

    expect(decoded.email).toBe(body.email);
});

test("Catch error if user not exists", async () => {
    const body = {
        email: "not_exists@mail.com",
        password: "1234"
    };

    const [, err] = await authApplicationService.signIn({body});

    expect(UserNotExists().type).toBe(err.type);
});