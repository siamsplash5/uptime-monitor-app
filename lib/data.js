// dependencies

const fs = require('fs');
const path = require('path');

// module scaffolding

const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname, '../.data/');

// write data to file
lib.create = (dir, file, data, callback) => {
    // open file for writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptior) => {
        if (!err && fileDescriptior) {
            // convert data to string
            const stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptior, stringData, (err2) => {
                if (!err2) {
                    // close the file
                    fs.close(fileDescriptior, (err3) => {
                        if (!err3) {
                            callback(false);
                        } else {
                            callback('Error closing new file');
                        }
                    });
                } else {
                    callback('Error when writing new file');
                }
            });
        } else {
            callback('Error while creating file');
        }
    });
};

lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        if (!err) {
            callback(false, data);
        } else {
            callback('error while reading file');
        }
    });
};

lib.update = (dir, file, data, callback) => {
    // open the file
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptior) => {
        if (!err && fileDescriptior) {
            // convert the data to string
            const stringData = JSON.stringify(data);
            // truncate the file
            fs.ftruncate(fileDescriptior, (err2) => {
                if (!err2) {
                    // write the file
                    fs.writeFile(fileDescriptior, stringData, (err3) => {
                        if (!err3) {
                            // close the file
                            fs.close(fileDescriptior, (err4) => {
                                if (!err4) {
                                    callback(false);
                                } else {
                                    console.log('File closing error');
                                }
                            });
                        } else {
                            console.log('Write file error');
                        }
                    });
                } else {
                    console.log('truncate error');
                }
            });
        } else {
            console.log('No such file found');
        }
    });
};

lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false);
        } else {
            console.log('No such file found while deletion');
        }
    });
};

// list all the items in a directory

lib.list = (dir, callback) => {
    fs.readdir(`${lib.basedir + dir}/`, (err, fileNames) => {
        if (!err && fileNames && fileNames.length > 0) {
            const trimmedFileNames = [];
            fileNames.forEach((fileName) => {
                trimmedFileNames.push(fileName.replace('.json', ''));
            });
            callback(false, trimmedFileNames);
        } else {
            callback('List not found, maybe directory empty');
        }
    });
};

module.exports = lib;
