const bcrypt = require("bcrypt");
const crypto = require("crypto");
const stream = require("stream");
const request = require("request");
const {generateKeyPair} = require("crypto");

const {UserNotExists, WrongPassword, UserPublicKeyNotFound, UserPrivateKeyNotFound} = require("../../../api/errors/users");
const conn = require("../../db/connection");
const jwtUtils = require("../../utils/jwt");
const bufferUtils = require("../../utils/buffer");

const MODULUS_LENGTH = 4096;
const maxChunkSize = 470;

module.exports = {
    signIn: async ({body}) => {
        const db = await conn.client();

        const existingUser = await db
            .collection("users")
            .findOne({email: body.email});

        if (!existingUser) {
            return [null, UserNotExists()];
        }

        const match = await bcrypt.compare(body.password, existingUser.password);

        if (!match) {
            return [null, WrongPassword()];
        }

        const authToken = jwtUtils.sign({
            data: {
                email: body.email
            }
        });

        return [{authToken}, null];
    },
    generateKeyPair: async ({user, getCurrentUser}) => {
        const db = await conn.client();

        const keys = await new Promise((resolve, reject) => {
            generateKeyPair(
                "rsa",
                {
                    modulusLength: MODULUS_LENGTH,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem',
                        cipher: 'aes-256-cbc',
                        passphrase: getCurrentUser.password
                    }
                },
                (err, publicKey, privateKey) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            publicKey,
                            privateKey
                        });
                    }
                }
            );
        });

        await db.collection("users").updateOne(
            {email: user.email},
            {
                publicKey: keys.publicKey,
                privateKey: keys.privateKey
            }
        );

        return [
            {
                privKey: keys.privateKey,
                pubKey: keys.publicKey
            },
            null
        ];
    },
    /*
        NOTE: encryption using RSA public key may be a not best solution because nature of asymmetric.

        The second solution could be an encryption using using AES (symmetric encryption) with RSA.
        To protect AES hash we'll use asymmetric (RSA) encryption.

        I understood that I need only public RSA key to encrypt PDF that's why I didn't implement AES with RSA.
    */
    encrypt: async ({getCurrentUser}) => {
        if (!getCurrentUser.publicKey) {
            return [null, UserPublicKeyNotFound];
        }

        const optionsStart = {
            uri: "http://www.africau.edu/images/default/sample.pdf",
            method: "GET",
            encoding: null,
        };

        const buffer = new stream.Readable();
        buffer._read = () => {
        };

        request.get(optionsStart)
            .on("data", data => {
                const chunked = bufferUtils.chunk(data, maxChunkSize);

                chunked
                    .forEach(chunk => buffer.push(
                        crypto.publicEncrypt(getCurrentUser.publicKey, chunk)
                    ));
            })
            .on("end", () => {
                buffer.push(null)
            });

        return [buffer]
    },
    decrypt: async ({body, getCurrentUser}) => {
        if (!getCurrentUser.privateKey) {
            return [null, UserPrivateKeyNotFound];
        }

        const chunked = bufferUtils.chunk(Buffer.from(body.message, "base64"));

        const response = chunked.map(ch => crypto.privateDecrypt({
            key: getCurrentUser.privateKey,
            passphrase: getCurrentUser.password
        }, ch));

        return [
            Buffer.concat(response),
            null
        ]
    }
};
