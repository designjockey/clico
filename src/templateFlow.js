const {
  templateChoices,
  templateVariablePrompt,
  templateWriteToChoices,
  getFilePathAndName,
  getExistingFileName,
} = require('./prompts');
const { appendToFile, generateFile } = require('./fileOperations');

const handleFileWrite = (isNewFile, content) => {
  if (isNewFile) {
    getFilePathAndName().then(fileName => generateFile(fileName, content));
  } else {
    getExistingFileName().then(fileName => appendToFile(fileName, content));
  }
};

const executeFlow = templates =>
  templateChoices(templates)
    .then(({ template }) => templateVariablePrompt(template))
    .then(compiledTemplate =>
      templateWriteToChoices().then(writeTo => handleFileWrite(writeTo === 'new', compiledTemplate))
    );

module.exports = {
  executeFlow,
};
