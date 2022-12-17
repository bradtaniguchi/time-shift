# CONTRIBUTING

Below is the generated documentation for working on VSCode extension.

## Committing

Committing is linted via [commitlint](https://github.com/conventional-changelog/commitlint),
this helps generate changelogs for each release.

We follow the `config-conventional` setup, and support
the prefixes listed in [.commitlintrc.json](./.commitlintrc.json)

## Initializing repository locally

To get started working on this extension, clone this repo locally:

```bash
git clone git@github.com:bradtaniguchi/time-shift.git
```

install dependencies with:

```bash
npm install
```

## Running and debugging the extension

- Press `F5` to open a new window with your extension loaded.
  - alternatively go to the debug menu in VSCode and click on the "Run extension" target at the top
- Run your command from the command palette by pressing (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) and typing `Hello World`.
- Set breakpoints in your code inside `src/extension.ts` to debug your extension.
- Find output from your extension in the debug console.

## Making changes

- You can relaunch the extension from the debug toolbar after changing code in `src/extension.ts`.
- You can also reload (`Ctrl+R` or `Cmd+R` on Mac) the VS Code window with your extension to load your changes.

## Exploring the API

- You can open the full set of our API when you open the file [node_modules/@types/vscode/index.d.ts](./node_modules/@types/vscode/index.d.ts).

## Running tests

- Open the debug viewlet (`Ctrl+Shift+D` or `Cmd+Shift+D` on Mac) and from the launch configuration dropdown pick `Extension Tests`.
- Press `F5` to run the tests in a new window with your extension loaded.
- See the output of the test result in the debug console.
- Make changes to `src/test/suite/extension.test.ts` or create new test files inside the `test/suite` folder.
  - The provided test runner will only consider files matching the name pattern `**.test.ts`.
  - You can create folders inside the `test` folder to structure your tests any way you want.

## Go further

- Reduce the extension size and improve the startup time by [bundling your extension](https://code.visualstudio.com/api/working-with-extensions/bundling-extension).
- [Publish your extension](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) on the VS Code extension marketplace.
- Automate builds by setting up [Continuous Integration](https://code.visualstudio.com/api/working-with-extensions/continuous-integration).
