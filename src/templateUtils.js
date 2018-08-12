const dot = require('dot');

dot.templateSettings = {
  interpolate: /\{\{=([\s\S]+?)\}\}/g,
  varname: 'clico',
  string: false,
};

// TODO: Parse and cache into a config file
const parseTemplateVariables = templateContent => {
  const pattern = /\{\{=clico\.(.*)\}\}/gm;

  return templateContent
    .match(new RegExp(pattern.source, pattern.flags))
    .map(match => new RegExp(pattern.source, pattern.flags).exec(match)[1]);
};

const compileTemplate = (templateName, templateData) => {
  const templateContent = require(`../templates/${templateName}`);
  const templateFunction = dot.template(templateContent);

  return templateFunction(templateData);
};

module.exports = {
  compileTemplate,
  parseTemplateVariables,
};
