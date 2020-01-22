const request = require("request");

const conn = require("../src/db/connection");
const inMemoryDB = require("../src/db/db");
const authApplicationService = require("../src/application/services/auth");

const mockDB = {
    users: [
        {
            email: "test@mail.com",
            password: "$2b$10$jQcnewzDkkOF90BOApJHhOwqD2bRrywKLpZlfBiC9N/1fqTe5V2W2",

            // passphrase: 1234
            privateKey: "-----BEGIN RSA PRIVATE KEY-----\nProc-Type: 4,ENCRYPTED\nDEK-Info: AES-256-CBC,C6AF92DF90220693026BC90C62446E88\n\n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\n-----END RSA PRIVATE KEY-----\n",
            publicKey: "-----BEGIN RSA PUBLIC KEY-----\nMIICCgKCAgEAvfWChvmkJAXviATwlRgQSx6XXMMuHQxZS/Kw67JIEdGj8cM18uKj\nfbfnDufYJyBIP1y4iyh9XM9Vf1z/fRokqPMV/IKTccXAy0XYlSZEGC6VVk1cS33i\nmHHeA/oH/u5BqOt7xDAuYePhNjLDhq4VQ89unfiHSOToOPxMjbCuDDgeQt4dRprM\nWdmnQgVGflIdx1zCa11O59h4Dpn5KtV6oG3Z+5EoN601Cir5nxVQf2VwW3I9RGTP\nVZ+OZ3SZAaaWBRAfyBxJ4mSxZ0Zwuy3C8duXyXO0LvadRUKBUcs/VpPYycqkxO3m\nFWh8tQznpCh8NI+pVhzq5yySkUUw+LVGpFb3GnzfC6KGiG5wg0oA5GE7hMOEg7qH\nHTsiA56YYSujlbNYraX8lQeNaRL3mMpQC8d4Y+ZBT6vtjfBWQnaXy6j0WSL09lzp\nNCM30fTuuTImmzN1qh3Aj/Yh/fmCf4wASpxaDUnR69E0FhpzUGzAJRlS7XTW0+1r\nRA/4GC77/bW482zBV9quhQByyR33fAbwM15aj6St5wJNEvrrZViG6eMNuXPCDJ6O\nhT27A1aeyQaC4vObtErELFgVDQ/EG9+Pb5ZS3PWdU0fQJ5bUpDzzFquCS312s6xe\n1E+brzXOyhsjbhKw+IMNwKg/DZvDHUNy6HIiBIz0xMY48gkooFwV+SkCAwEAAQ==\n-----END RSA PUBLIC KEY-----\n",
        }
    ]
};

beforeEach(() => {
    conn.client = jest.fn(() => new Promise((resolve) => {
        resolve(inMemoryDB(mockDB))
    }));

    process.env = Object.assign(process.env, {JWT_SECRET: "secret"});
});

test("Encrypt example PDF file stream", async done => {
    const user = mockDB.users[0];

    const getCurrentUser = Object.assign({}, user, {
        password: "1234"
    });

    const [stream] = await authApplicationService.encrypt({
        getCurrentUser
    });

    const chunks = [];

    const onData = chunk => chunks.push(chunk);

    const onEnd = async () => {
        const base64Message = Buffer.concat(chunks).toString("base64");

        const [decrypted] = await authApplicationService.decrypt({
            getCurrentUser,
            body: {
                message: base64Message
            }
        });

        const optionsStart = {
            uri: "http://www.africau.edu/images/default/sample.pdf",
            method: "GET",
            encoding: null,
        };

        request(optionsStart, (err, response) => {
            expect(response.body.toString("base64")).toBe(decrypted.toString("base64"));

            done();
        });
    };

    stream
        .on("data", onData)
        .on("end", onEnd)
});

