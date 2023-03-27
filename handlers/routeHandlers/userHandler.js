/* eslint-disable prettier/prettier */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
/*
Title: User Page Handler
Description: Handle the activity of the user.
Author Name: Siam Ahmed
Date: 21/03/2023

*/

// dependencies

const data = require('../../lib/data');
const { hash, parseJSON, isValidName, isValidPhone, isValidPassword } = require('../../helper/utilites');
const tokenHandler = require('./tokenHandler');

// module scaffolding

const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    const { method } = requestProperties;
    if (acceptedMethods.includes(method)) {
        handler._user[method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'you are not allowed',
        });
    }
};

handler._user = {};

handler._user.post = (requestProperties, callback) => {
    const { firstName, lastName, phone, password, tosAgreement } = requestProperties.body;
    if (isValidName(firstName)
    && isValidName(lastName) && isValidPhone(phone) && isValidPassword(password) && tosAgreement) {
        // make sure that the user doesn't already exist
        data.read('users', phone, (err) => {
            if (err) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };

                // store the user to the db
                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200, { message: 'user has created succesfully' });
                    } else {
                        callback(400, { message: 'could not create user' });
                    }
                });
            } else {
                callback(400, {
                    error: 'User already exist!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'Please provide the correct informations and accept the terms of service',
        });
    }
};

handler._user.get = (requestProperties, callback) => {
    const { phone } = requestProperties.queryStringObject;
    const { token } = requestProperties.headerObject;

    tokenHandler._token.verify(phone, token, (err) => {
        if (!err) {
            data.read('users', phone, (err2, u) => {
            if (!err2) {
                const userData = parseJSON(u);
                delete userData.password;
                callback(200, userData);
            } else {
                callback(400, { error: 'data not found!' });
            }
        });
        } else {
            callback(400, err);
        }
    });
};

handler._user.put = (requestProperties, callback) => {
    const { phone } = requestProperties.queryStringObject;
    const { token } = requestProperties.headerObject;
    tokenHandler._token.verify(phone, token, (err) => {
        if (!err) {
            const { firstName, lastName, password } = requestProperties.body;
            if (isValidName(firstName) || isValidName(lastName) || isValidPassword(password)) {
                data.read('users', phone, (err2, u) => {
                    if (!err2) {
                        let userData = u;
                        userData = parseJSON(userData);
                        if (firstName)userData.firstName = firstName;
                        if (lastName)userData.lastName = lastName;
                        if (password)userData.password = password;
                        // update the data into db
                        data.update('users', phone, userData, (err3) => {
                            if (!err3) {
                                callback(201, { message: 'updated successfully' });
                            } else {
                                callback(500, { error: 'Internal Server Error' });
                            }
                        });
                    } else {
                        callback(500, { error: 'Internal Server Error' });
                    }
                });
            } else {
            callback(400, { error: 'Enter valid data to update.' });
            }
        } else {
            callback(400, err);
        }
    });
};

handler._user.delete = (requestProperties, callback) => {
    const { phone } = requestProperties.queryStringObject;
   const { token } = requestProperties.headerObject;
   tokenHandler._token.verify(phone, token, (err) => {
    if (!err) {
        data.read('users', phone, (err2) => {
            if (!err2) {
                data.delete('users', phone, (err3) => {
                    if (!err3) {
                        callback(200, { message: 'Deleted succesfully' });
                    } else {
                        callback(500, { error: 'Internal Server Error' });
                    }
                });
            } else {
                callback(404, { error: 'User does not exist.' });
            }
        });
    } else {
        callback(400, err);
    }
   });
};

module.exports = handler;
