const fs = require('fs');
const { appendToFile } = require('../src/fileOperations');

jest.mock('fs');
const mockAppendFile = error => {
  fs.appendFile = jest.fn((...args) => args[2](error));
};

describe('src/fileOperations', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#appendToFile', () => {
    test('successful save', () => {
      mockAppendFile();
      console.log = jest.fn();

      appendToFile('some/file/name.js', 'File contents');

      expect(fs.appendFile).toHaveBeenCalledWith(
        'some/file/name.js',
        'File contents',
        expect.any(Function)
      );
      expect(console.log).toHaveBeenCalledWith('File saved!');
    });

    test('unsuccessful save', () => {
      mockAppendFile('some error message');

      expect(() => {
        appendToFile('some/file/name.js', 'File contents');
      }).toThrowError(/^some error message$/);
    });
  });
});
