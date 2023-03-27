/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
/*
Title: Check Page Handler
Description: Handle the checking activity of url.
Author Name: Siam Ahmed
Date: 24/03/2023

*/

// dependencies

const { isValidProtocol, isValidUrl, isValidMethod, isValidSuccessCode, isValidTimeOutSecond, parseJSON, createRandomString } = require('../../helper/utilites');
const data = require('../../lib/data');
const { maxChecks } = require('../../helper/environments');

// module scaffolding

const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    const { method } = requestProperties;
    if (acceptedMethods.includes(method)) {
        handler._check[method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'you are not allowed',
        });
    }
};

handler._check = {};

handler._check.post = (requestProperties, callback) => {
    const { token } = requestProperties.headerObject;
    data.read('tokens', token, (err, tokenData) => {
        if (!err) {
            const { phone, expireTime } = parseJSON(tokenData);
            if (expireTime > Date.now()) {
                data.read('users', phone, (err2, u) => {
                    if (!err2) {
                        const userData = parseJSON(u);
                        let checkArray = userData.checks;
                        checkArray = typeof checkArray === 'object' && checkArray instanceof Array ? checkArray : [];
                        if (checkArray.length < maxChecks) {
                            const { protocol, url, method, successCode, timeoutSecond } = requestProperties.body;
                            if (isValidProtocol(protocol) && isValidUrl(url) && isValidMethod(method)
                            && isValidSuccessCode(successCode) && isValidTimeOutSecond(timeoutSecond)) {
                                const checkID = createRandomString(10);
                                const checkObject = {
                                    phone, protocol, url, method, successCode, timeoutSecond,
                                };
                                data.create('checks', checkID, checkObject, (err3) => {
                                    if (!err3) {
                                        checkArray.push(checkID);
                                        userData.checks = checkArray;
                                        data.update('users', phone, userData, (err4) => {
                                            if (!err4) {
                                                callback(200, { message: 'Success' });
                                            } else {
                                                callback(403, { error: 'Internal Server Error' });
                                            }
                                        });
                                    } else {
                                        callback(500, { error: 'Internal Server Error' });
                                    }
                                });
                            } else {
                                callback(403, { error: 'Provide correct info' });
                            }
                        } else {
                            callback(400, { error: 'Maximum url adding limit has reached.' });
                        }
                    } else {
                        callback(403, { error: 'User not found' });
                    }
                });
            } else {
                callback(400, { error: 'Season expired' });
            }
        } else {
            callback(403, { error: 'Invalid token ID' });
        }
    });
};

handler._check.get = (requestProperties, callback) => {
    const { token } = requestProperties.headerObject;
    const { checkid } = requestProperties.queryStringObject;
    data.read('tokens', token, (err, tokenData) => {
        if (!err) {
            const { phone, expireTime } = parseJSON(tokenData);
            if (expireTime > Date.now()) {
                data.read('checks', checkid, (err2, checkData) => {
                    if (!err2) {
                        const checkDataPhone = parseJSON(checkData).phone;
                        if (checkDataPhone === phone) {
                            callback(200, parseJSON(checkData));
                        } else {
                            callback(404, { error: 'Check ID does not exist' });
                        }
                    } else {
                        callback(500, { error: 'Check ID does not exist' });
                    }
                });
            } else {
                callback(404, { error: 'season expired' });
            }
        } else {
            callback(404, { error: 'Invalid ID' });
        }
    });
};

handler._check.put = (requestProperties, callback) => {
    const { token } = requestProperties.headerObject;
    const { checkid } = requestProperties.queryStringObject;
    data.read('tokens', token, (err, tokenData) => {
        if (!err) {
            const { phone, expireTime } = parseJSON(tokenData);
            if (expireTime > Date.now()) {
                data.read('checks', checkid, (err2, cd) => {
                    if (!err2 && parseJSON(cd).phone === phone) {
                        const checkData = parseJSON(cd);
                        const { method, successCode, timeoutSecond } = requestProperties.body;
                        checkData.method = isValidMethod(method) ? method : checkData.method;
                        checkData.successCode = isValidSuccessCode(successCode) ? successCode : checkData.successCode;
                        checkData.timeoutSecond = isValidTimeOutSecond(timeoutSecond) ? timeoutSecond : checkData.timeoutSecond;
                        data.update('checks', checkid, checkData, (err3) => {
                            if (!err3) {
                                callback(200, { message: 'updated succesfully' });
                            } else {
                                callback(500, { error: 'Internal Server Error' });
                            }
                        });
                    } else {
                        callback(404, { error: 'Invalid checkID' });
                    }
                });
            } else {
                callback(404, { error: 'Season expired' });
            }
        } else {
            callback(404, { error: 'Invalid id' });
        }
    });
};

handler._check.delete = (requestProperties, callback) => {
    // authentication
    const { token } = requestProperties.headerObject;
    const { checkid } = requestProperties.queryStringObject;
    data.read('tokens', token, (err, tokenData) => {
        if (!err) {
            const { phone, expireTime } = parseJSON(tokenData);
            if (expireTime > Date.now()) {
                data.read('checks', checkid, (err2, checkData) => {
                    if (!err2) {
                        const checkDataPhone = parseJSON(checkData).phone;
                        if (checkDataPhone === phone) {
                            data.delete('checks', checkid, (err3) => {
                                if (!err3) {
                                    callback(200, { error: 'deletion successful' });
                                } else {
                                    callback(404, { error: 'Invalid id' });
                                }
                            });
                        } else {
                            callback(404, { error: 'Check id is invalid' });
                        }
                    } else {
                        callback(404, { error: 'Check id is invalid' });
                    }
                });
            } else {
                callback(404, { error: 'Season expired' });
            }
        } else {
            callback(404, { error: 'Invalid id' });
        }
    });
};

module.exports = handler;
