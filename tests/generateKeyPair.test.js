const crypto = require("crypto");

const conn = require("../src/db/connection");
const inMemoryDB = require("../src/db/db");

const authApplicationService = require("../src/application/services/auth");

const mockDB = {
    users: [
        {
            email: "test@mail.com",
            password: "$2b$10$jQcnewzDkkOF90BOApJHhOwqD2bRrywKLpZlfBiC9N/1fqTe5V2W2",
        }
    ]
};

beforeEach(() => {
    conn.client = jest.fn(() => new Promise((resolve) => {
        resolve(inMemoryDB(mockDB))
    }));

    process.env = Object.assign(process.env, {JWT_SECRET: "secret"});
});

test("Generate RSA key pair", async () => {
    const user = {
        email: "test@mail.com",
    };

    const getCurrentUser = Object.assign({}, user, {
        password: "1234"
    });

    const [response] = await authApplicationService.generateKeyPair({user, getCurrentUser});

    const testMessage = "test";

    const encrypted = crypto.publicEncrypt(
        {
            key: response.pubKey
        },
        Buffer.from(testMessage)
    );

    const decrypted = crypto.privateDecrypt({
        key: response.privKey,
        passphrase: getCurrentUser.password
    }, encrypted).toString();

    expect(decrypted).toBe(testMessage);
});

