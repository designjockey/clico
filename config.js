const path = require('path');
const config = require(path.join(process.cwd(), '/package.json'));

const options = {
  templateDirectory: 'templates',
  ...(config.clico || {}),
};

module.exports = {
  templateDirectoryPath: `${process.cwd()}/${options.templateDirectory}`,
};
