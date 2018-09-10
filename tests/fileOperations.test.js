const fs = require('fs');
const { appendToFile, getFileList, readFile, generateFile } = require('../src/fileOperations');

jest.mock('fs');
const mockCallbackWithError = error => jest.fn((...args) => args[2](error));
const mockAppendFile = error => {
  fs.appendFile = mockCallbackWithError(error);
};
const mockReadDir = error => {
  fs.readdir = jest.fn((...args) => args[1](error, ['file1.js', 'file2.jsx']));
};
const mockReadFile = error => {
  fs.readFile = jest.fn((...args) => args[2](error, 'File contents'));
};
const mockOpen = error => {
  fs.open = mockCallbackWithError(error);
};
const mockWriteFile = error => {
  fs.writeFile = mockCallbackWithError(error);
};
const errorMessage = 'some error message';

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
      mockAppendFile(errorMessage);

      expect(() => {
        appendToFile('some/file/name.js', 'File contents');
      }).toThrowError(/^some error message$/);
    });
  });

  describe('#getFileList', () => {
    test('returns filename list', done => {
      mockReadDir();

      getFileList('some/dir/path/')
        .then(filenames => {
          expect(filenames).toEqual(['file1.js', 'file2.jsx']);
          done();
        })
        .catch(error => expect(error).toBeFalsy());
    });

    test('throws error', done => {
      mockReadDir(errorMessage);

      getFileList('some/dir/path/').catch(error => {
        expect(error).toBe(errorMessage);
        done();
      });
    });
  });

  describe('#readFile', () => {
    test('returns file content', done => {
      mockReadFile();

      readFile('myTemplateName.js')
        .then(content => {
          expect(content).toEqual('File contents');
          done();
        })
        .catch(error => expect(error).toBeFalsy());
    });

    test('throws error', done => {
      mockReadFile(errorMessage);

      readFile('myTemplateName.js').catch(error => {
        expect(error).toBe(errorMessage);
        done();
      });
    });
  });

  describe('#generateFile', () => {
    test('creates and saves file', () => {
      mockOpen();
      mockWriteFile();
      console.log = jest.fn();

      generateFile('some/path/file.js', 'File contents');

      expect(console.log).toHaveBeenCalledWith('File saved!');
    });

    test("throws when can't open file", () => {
      mockOpen(errorMessage);

      expect(() => generateFile('some/path/file.js', 'File contents')).toThrowError(
        /^some error message$/
      );
    });

    test('shows console error when file exists', () => {
      mockOpen({ code: 'EEXIST' });
      console.error = jest.fn();

      generateFile('some/path/file.js', 'File contents');

      expect(console.error).toHaveBeenCalledWith('some/path/file.js already exists');
    });

    test('throws when write fails', () => {
      mockOpen();
      mockWriteFile(errorMessage);

      expect(() => generateFile('some/path/file.js', 'File contents')).toThrowError(
        /^some error message$/
      );
    });
  });
});
