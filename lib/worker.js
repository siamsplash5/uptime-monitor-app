/* eslint-disable no-unused-vars */
/*

Title: Worker Library
Description: Worker related files
Author Name: Siam Ahmed
Date: 25/03/2023

*/

// dependencies
const url = require('url');
const http = require('http');
const https = require('https');
const data = require('./data');
const { parseJSON } = require('../helper/utilites');
const { sentTwilioSms } = require('../helper/utilites');

// worker object - module scaffold
const worker = {};

// lookup all the checks
worker.gatherAllChecks = () => {
    data.list('checks', (err, checks) => {
        if (!err && checks) {
            checks.forEach((check) => {
                // read the check data
                data.read('checks', check, (err2, _checkData) => {
                    if (!err2) {
                        const checkData = parseJSON(_checkData);
                        checkData.fileName = check;
                        // pass the data to the next process
                        worker.validateCheckData(checkData);
                    } else {
                        console.log('Error reading one of the checks data');
                    }
                });
            });
        } else {
            console.log('There is a error in gather all check.');
        }
    });
};

// validate inidividual check data
worker.validateCheckData = (originalCheckData) => {
    const originalData = originalCheckData;
    // eslint-disable-next-line prettier/prettier
    originalData.state = typeof originalData.state === 'string' && ['up', 'down'].includes(originalData.state)
            ? originalData.state
            : 'down';
    // eslint-disable-next-line prettier/prettier
    originalData.lastChecked = typeof originalData.lastChecked === 'number' && originalData.lastChecked > 0
            ? originalData.lastChecked
            : false;

    // passed to the next process
    worker.performCheck(originalData);
};

// perform check

worker.performCheck = (originalData) => {
    // prepare the initial check outcome
    let checkOutCome = {
        error: false,
        responseCode: false,
    };

    // mark the outcome has not been sent yet
    let outComeSent = false;
    // parse the hostname and full url from original data
    const parsedUrl = url.parse(`${originalData.protocol}://${originalData.url}`, true);
    const { hostname, path } = parsedUrl;
    const { method } = originalData;
    // construct the request
    const requestDetails = {
        protocol: `${originalData.protocol}:`,
        hostname,
        method,
        path,
        timeout: originalData.timeoutSecond * 1000,
    };
    const protocolToUse = originalData.protocol === 'http' ? http : https;
    const req = protocolToUse.request(requestDetails, (res) => {
        // grab the status code of the response
        const status = res.statusCode;
        // update the check outcome and pass to the next process
        if (!outComeSent) {
            checkOutCome.responseCode = status;
            // console.log(status);
            // console.log(originalData);
            worker.processCheckOutcome(originalData, checkOutCome);
            outComeSent = true;
        }
    });

    req.on('error', (e) => {
        checkOutCome = {
            error: true,
            value: e,
        };
        if (!outComeSent) {
            worker.processCheckOutcome(originalData, checkOutCome);
            outComeSent = true;
        }
    });

    req.on('timeout', (e) => {
        checkOutCome = {
            error: true,
            value: 'timeout',
        };
        if (!outComeSent) {
            worker.processCheckOutcome(originalData, checkOutCome);
            outComeSent = true;
        }
    });

    // req send
    req.end();
};

// sava check outcome to database and send to next process
worker.processCheckOutcome = (_originalCheckData, checkOutCome) => {
    // check if check outcome is up or down
    // eslint-disable-next-line max-len, prettier/prettier
    const state = !checkOutCome.error && checkOutCome.responseCode && _originalCheckData.successCode.includes(checkOutCome.responseCode) ? 'up' : 'down';

    // // decide we should allow the user or not

    const alertWanted = _originalCheckData.lastChecked && _originalCheckData.state !== state;

    // // update the check data
    const originalData = _originalCheckData;
    originalData.state = state;
    originalData.lastChecked = Date.now();
    // // update the data to disk
    data.update('checks', originalData.fileName, originalData, (err) => {
        if (!err) {
            if (alertWanted) {
                // worker.alertUserToStatusChange(newCheckData);
                console.log('done ####################################');
            } else {
                console.log('Alert is not needed as there is no change in state');
            }
        } else {
            console.log('Error while trying to save the state and last updates');
        }
    });
};

worker.alertUserToStatusChange = (newCheckData) => {
    const msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${
        newCheckData.protocol
    }://${newCheckData.url} is
    currently ${newCheckData.state}`;
    sentTwilioSms(newCheckData.phone, msg, (err) => {
        if (!err) {
            console.log('succes!!!');
        } else {
            console.log('There was a problem sending to one of the user!');
        }
    });
};

// timer to execute the worker process once per minute
worker.loop = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 8000);
};

// create a worker
worker.init = () => {
    // execute all the checks
    worker.gatherAllChecks();

    // call the loop for checks continue

    worker.loop();
};

// export
module.exports = worker;
