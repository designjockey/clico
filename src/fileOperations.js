const fs = require('fs');
const { templateDirectoryPath } = require('../config');

const getFileList = dirPath => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, filenames) => {
      if (err) {
        reject(err);
      }

      resolve(filenames);
    });
  });
};

const readFile = templateName => {
  const template = `${templateDirectoryPath}/${templateName}`;

  return new Promise((resolve, reject) => {
    fs.readFile(template, 'utf-8', (err, content) => {
      if (err) {
        return reject(err);
      }

      return resolve(content);
    });
  });
};

const generateFile = (filePathWithName, fileContent) => {
  fs.open(filePathWithName, 'wx', (err, fd) => {
    if (err) {
      if (err.code === 'EEXIST') {
        console.error(`${filePathWithName} already exists`);
        return;
      }

      throw err;
    }

    fs.writeFile(filePathWithName, fileContent, err => {
      if (err) {
        throw err;
      }

      console.log('File saved!');
    });
  });
};

const appendToFile = (filePathWithName, fileContent) => {
  fs.appendFile(filePathWithName, fileContent, err => {
    if (err) {
      throw err;
    }

    console.log('File saved!');
  });
};

module.exports = {
  appendToFile,
  getFileList,
  readFile,
  generateFile,
};
