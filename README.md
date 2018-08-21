# CLICO ![img](https://circleci.com/gh/designjockey/clico.svg?&style=shield&circle-token=7ceacdf6c6f80bb8a13ac67969327d474dfeec47)
> CLI Code Orchestrator - Generate JS source code via CLI with pre-defined code templates

CLICO is a CLI interface to provide users to generate JS code using snippets. This is useful when there is a need for eliminating boilerplate using standardized code format. The preset templates can be defined to accept variables and the consuming user is prompted to provide values for these variables, the template is then compiled and injected in a file selected by the user.

## Installation

```sh
npm install -g clico
```

## Usage example

![gif](https://media.giphy.com/media/Ca0K0GU7xajssjLAnQ/giphy.gif)

The above example demonstrates the usage with the `action.jst` template file defined as:

```es6
// example/templates/action.jst

module.exports = `export const {{=clico.functionName}} = () => ({
  type: '{{=clico.actionTypeName}}',
  payload: {
    /* Add data here */
  }
});
`
```

After the user input below is the resulting file:

```es6
// generatedFiles/helloWorld.js

export const helloWorld = () => ({
  type: 'HELLO_WORLD_SET',
  payload: {
    /* Add data here */
  }
});
```

## Setup

To setup CLICO for usage in your project, follow the below steps:

1. CLICO will search for templates in `templates` folder by default, to define a custom template directory add config as below, in the `package.json` file

```
// package.json

"clico": {
  "templateDirectory": "mycustomdirectory"
}
```

2. Define template files in your template directory, follow the below as an example:

```es6
// example/templates/action.jst

module.exports = `export const {{=clico.functionName}} = () => ({
  type: '{{=clico.actionTypeName}}',
  payload: {
    /* Add data here */
  }
});

```

In the above example the variables are defined in expressions like `{{=clico.myVariableName}}`. CLICO parses all the templates and prompts the user to input the values for each of these variables.

3. Once you have the above setup, simply type `clico` in your project in the same directory as your `package.json` file and follow the prompts.
