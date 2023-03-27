/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
/*
Title: Token Handler
Description: Handle the token request of the users.
Author Name: Siam Ahmed
Date: 23/03/2023

*/

// dependencies

const data = require('../../lib/data');
const {
    hash,
    parseJSON,
    isValidPhone,
    isValidPassword,
    createRandomString,
} = require('../../helper/utilites');

// module scaffolding

const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    const { method } = requestProperties;
    if (acceptedMethods.includes(method)) {
        handler._token[method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'you are not allowed',
        });
    }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
    const { phone, password } = requestProperties.body;
    if (isValidPhone(phone) && isValidPassword(password)) {
        data.read('users', phone, (err, u) => {
            if (!err) {
                const hashedPassword = hash(password);
                const userData = parseJSON(u);
                if (hashedPassword === userData.password) {
                    const tokenID = createRandomString(20);
                    const expireTime = Date.now() + 60 * 60 * 1000;
                    const tokenObject = {
                        phone,
                        ID: tokenID,
                        expireTime,
                    };
                    data.create('tokens', tokenID, tokenObject, (err2) => {
                        if (!err2) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, { error: 'Internal server error' });
                        }
                    });
                } else callback(400, { error: 'Enter valid password' });
            } else callback(400, { error: 'Enter valid phone number.' });
        });
    } else {
        callback(400, {
            error: 'Please provide the correct informations and accept the terms of service',
        });
    }
};

handler._token.get = (requestProperties, callback) => {
    const { id } = requestProperties.queryStringObject;
    data.read('tokens', id, (err, u) => {
        if (!err) {
            const userData = parseJSON(u);
            callback(200, userData);
        } else {
            callback(404, { error: 'Invalid ID' });
        }
    });
};

handler._token.put = (requestProperties, callback) => {
    const { id, extendTime } = requestProperties.body;
    if (extendTime) {
        data.read('tokens', id, (err, u) => {
            if (!err) {
                const userData = parseJSON(u);
                if (userData.expireTime >= Date.now()) {
                    userData.expireTime = Date.now() + 60 * 60 * 1000;
                    // extend the season
                    data.update('tokens', id, userData, (err2) => {
                        if (!err2) {
                            callback(200, { error: 'Season extended.' });
                        } else {
                            callback(500, { error: 'Internal Server Error' });
                        }
                    });
                } else {
                    callback(400, { error: 'season expired. log in again' });
                }
            } else {
                callback(404, { error: 'This is invalid ID' });
            }
        });
    } else {
        callback(404, { error: 'Error in your request' });
    }
};

handler._token.delete = (requestProperties, callback) => {
    const { id } = requestProperties.queryStringObject;
    data.read('tokens', id, (err) => {
        if (!err) {
            data.delete('tokens', id, (err2) => {
                if (!err2) {
                    callback(200, { message: 'Logout successfully' });
                } else {
                    callback(500, { error: 'Internal Server Error' });
                }
            });
        } else {
            callback(404, { error: 'Invalid ID' });
        }
    });
};

handler._token.verify = (phone, id, callback) => {
    if (isValidPhone(phone)) {
        data.read('tokens', id, (err, u) => {
            if (!err) {
                const userData = parseJSON(u);
                if (userData.phone === phone) {
                    callback();
                } else {
                    callback({ error: 'You do not have permission' });
                }
            } else {
                callback({ error: 'Invalid ID' });
            }
        });
    } else {
        callback({ error: 'Invalid phone number' });
    }
};

module.exports = handler;
