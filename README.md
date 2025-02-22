# DeepSkeet AI VSCode Extension

An extension I've created for my personal Deep Skibidi Skeet Skeet AI assistant.

> DeepSeek Personal VSCode extension.

## Prequisites & Handy Info

- You will need to have already downloaded or setup Ollama: https://ollama.com/

- I'm running this on mac

## Run Locally

1. `git clone` this project repo.
2. `npm install`
3. Check `package.json`. Go to 'contributes' -> 'commands'. From here you can see which command I have to startup my AI assistant.
4. If you change this make sure you run `npm install && npm run compile`

For now its called `Chat with DeepSkeet`

You can check this extension out by opening a debugger for this project: `cmd + shift + p`

- `Debug: Select and Start Debugging` -> open this in a new vs code window
- `cmd + shift + p` -> type `Chat with DeepSkeet`
- Your debugger will then run whatever is in `src/extensions.ts`.

## In your terminal

This is what your project path might look like: `~/dev/deepskeet-ai-assistant`

What you'll need to do next is download the AI model you want. For this we are using `DeepSeek R1`.

Hence, run this in the terminal `ollama run deepseek-r1`

## Adding to your vscode

1. First `npm install -g @vscode/vsce`. If this doesnt work then `npm install @vscode/vsce`
2. then on the project directory: `vsce package`. This will generate a `.vsix` file
3. Upload this file to your extensions.

You can read all about it here: https://code.visualstudio.com/api/working-with-extensions/publishing-extension

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

- `myExtension.enable`: Enable/disable this extension.
- `myExtension.thing`: Set to `blah` to do something.
