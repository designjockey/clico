const { executeFlow } = require('../src/templateFlow');
const {
  templateChoices,
  templateVariablePrompt,
  templateWriteToChoices,
} = require('../src/prompts');

jest.mock('fs');
jest.mock('../src/prompts', () => ({
  templateChoices: jest.fn(() => Promise.resolve({ template: 'template2.jst' })),
  templateVariablePrompt: jest.fn(() => Promise.resolve('some template response')),
  templateWriteToChoices: jest.fn(() => Promise.resolve()),
  getExistingFileName: jest.fn(() => Promise.resolve()),
}));

describe('src/templateFLow', () => {
  const templates = ['template1.jst', 'template2.jst'];

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#executeFlow', () => {
    test('calls templateChoices with templates', () => {
      executeFlow(templates);

      expect(templateChoices).toHaveBeenCalledWith(templates);
    });

    test('calls templateVariablePrompt with the selected template', done => {
      executeFlow(templates)
        .then(() => {
          expect(templateVariablePrompt).toHaveBeenCalledWith('template2.jst');
          done();
        })
        .catch(err => expect(err).toBeFalsy());
    });

    test('calls templateWriteToChoices', done => {
      executeFlow(templates)
        .then(() => {
          expect(templateWriteToChoices).toHaveBeenCalledTimes(1);
          done();
        })
        .catch(err => expect(err).toBeFalsy());
    });
  });
});
