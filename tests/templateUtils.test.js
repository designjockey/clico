const { parseTemplateVariables, compileTemplate } = require('../src/templateUtils');

jest.mock('../config.js', () => ({
  templateDirectoryPath: '../example/templates',
}));

describe('src/templateUtils', () => {
  describe('#parseTemplateVariables', () => {
    test('returns variable name matches', () => {
      const templateContent = `export const {{=clico.functionName}} = () => ({
        type: '{{=clico.actionTypeName}}',
        payload: {
          /* Add data here */
        }
      });`;

      expect(parseTemplateVariables(templateContent)).toEqual(['functionName', 'actionTypeName']);
    });
  });

  describe('#compileTemplate', () => {
    test('returns compiled template', () => {
      const stripSpaces = string => string.replace(/\s/g, '');
      const received = compileTemplate('reducer.jst', {
        functionName: 'bar',
        actionTypeName: 'SOME_ACTION',
      });
      const expected = `
        export default function bar(state = {}, action) {
          switch (action.type) {
            case 'SOME_ACTION': {
              /* Do something */
            }
            break;
            default:
              return state;
          }
        };`;

      expect(stripSpaces(received)).toEqual(stripSpaces(expected));
    });
  });
});
