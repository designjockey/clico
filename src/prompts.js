const inquirer = require('inquirer');
const fuzzyPath = require('inquirer-fuzzy-path');
const { parseTemplateVariables, compileTemplate } = require('./templateUtils');
const { readFile } = require('./fileOperations');

inquirer.registerPrompt('fuzzyPath', fuzzyPath);

const templateChoices = templates => {
  const templatesPrompt = [
    {
      type: 'list',
      name: 'template',
      message: 'Which template would you like to use?',
      choices: templates,
    },
  ];

  return inquirer.prompt(templatesPrompt);
};

const templateVariablePrompt = templateName => {
  return readFile(templateName).then(content => {
    const variableQuestions = parseTemplateVariables(content).map(variable => ({
      type: 'input',
      name: variable,
      message: `What is the value for ${variable}:`,
    }));

    return inquirer.prompt(variableQuestions).then(answers => {
      return compileTemplate(templateName, answers);
    });
  });
};

const templateWriteToChoices = () => {
  const writeTo = [
    {
      type: 'list',
      name: 'writeTo',
      message: 'Save code to...',
      choices: [
        {
          name: 'Existing file',
          value: 'existing',
        },
        {
          name: 'New file',
          value: 'new',
        },
      ],
    },
  ];

  return inquirer.prompt(writeTo).then(({ writeTo }) => writeTo);
};

const getFilePathAndName = () => {
  const regexp = new RegExp(/node_modules/);

  const filePrompt = [
    {
      type: 'input',
      name: 'fileName',
      message: 'Enter a file name with extension:',
    },
    {
      type: 'fuzzyPath',
      name: 'path',
      pathFilter: (isDirectory, nodePath) => isDirectory && !regexp.test(nodePath),
      rootPath: '.',
      message: 'Select a target directory for the file:',
    },
  ];

  return inquirer.prompt(filePrompt).then(({ path, fileName }) => `${path}/${fileName}`);
};

const getExistingFileName = () => {
  const regexp = new RegExp(/node_modules/);

  const filePrompt = [
    {
      type: 'fuzzyPath',
      name: 'filePath',
      pathFilter: (_, nodePath) => !regexp.test(nodePath),
      message: 'Select a target file:',
    },
  ];

  return inquirer.prompt(filePrompt).then(({ filePath }) => filePath);
};

module.exports = {
  templateChoices,
  templateVariablePrompt,
  templateWriteToChoices,
  getFilePathAndName,
  getExistingFileName,
};
