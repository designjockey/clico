#!/usr/bin/env node
const dot = require('dot');
const colors = require('colors');
const { templateDirectoryPath } = require(`./config`);
const { getFileList } = require('./src/fileOperations');
const { executeFlow } = require('./src/templateFlow');

dot.templateSettings = {
  interpolate: /\{\{=([\s\S]+?)\}\}/g,
  varname: 'clico',
  string: false,
};

const start = () => {
  getFileList(templateDirectoryPath)
    .then(filenames => executeFlow(filenames.map(filename => filename)))
    .catch(err => {
      if (err.code === 'ENOENT') {
        console.error(
          colors.red(`Template directory not found ${templateDirectoryPath}`)
        );
        process.exit(1);
      }

      throw err;
    });
};

start();
