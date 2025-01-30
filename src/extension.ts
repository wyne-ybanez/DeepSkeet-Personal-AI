// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import ollama from 'ollama';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('"deepskeet-ai-assistant" is now active: DeepSkeet AI assistant ready!');

	// The command has been defined in the package.json file
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('deepskeet-ai-assistant.start', () => {
		// vscode.window.showInformationMessage('DeepSkeet AI assistant ready!');

		const panel = vscode.window.createWebviewPanel(
			'deepChat',
			'DeepSeek - DeepSkeeT Chat',
			vscode.ViewColumn.One,
			{ enableScripts: true }
		)

        panel.webview.html = getWebviewContent(panel.webview);

        panel.webview.onDidReceiveMessage(async (message: any) => {
            if (message.command === 'sendMessage') {
                const userPrompt = message.text
                let responseText = ''

                try {
                    const streamResponse = await ollama.chat({
                        model: 'deepseek-r1:7b',
                        messages: [{ role: 'user', content: userPrompt }],
                        stream: true,
                    })

                    for await (const part of streamResponse) {
                        responseText += part.message.content
                        panel.webview.postMessage({ command: 'messageResponse', text: responseText })
                    }
                } catch (err) {
                    panel.webview.postMessage({ command: 'messageResponse', text: `Error: ${String(err)}` })
                }
            }
        })
	});

	context.subscriptions.push(disposable);
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function getWebviewContent(webview: vscode.Webview): string {
    const nonce = getNonce();

	return /*html*/`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none';
            img-src ${webview.cspSource} https:;
            script-src 'nonce-${nonce}';
            style-src ${webview.cspSource} 'unsafe-inline';">
        <title>DeepSkeet Assistant</title>
        <style>
            body {
                padding: 0;
                color: var(--vscode-foreground);
                font-size: var(--vscode-font-size);
                font-weight: var(--vscode-font-weight);
                font-family: var(--vscode-font-family);
                background-color: var(--vscode-editor-background);
            }

            .container {
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .input-box {
                padding: 20px;
                border-radius: 5px;
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .message, #response {
                padding: 10px;
                border-radius: 5px;
                background-color: var(--vscode-editor-inactiveSelectionBackground);
            }

            button {
                color: var(--vscode-foreground);
                background-color: var(--vscode-input-background);
                border: 1px solid var(--vscode-input-border);
                padding: 8px;
                border-radius: 4px;
                cursor: pointer;
            }

            button:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="message" id="prompt">
                Ask something...
            </div>
            <div class="message" id="response">
                Welcome. I am DeepSkeet Assistant. How can I help you today?
            </div>
        </div>
        <div class="input-box">
            <textarea id="userInput" rows="3" placeholder="Type your message..."></textarea>
            <button id="sendButton">Send</button>
        </div>

        <script nonce="${nonce}">
            const vscode = acquireVsCodeApi();
            const input = document.getElementById('userInput');
            const container = document.querySelector('.container');
            const promptContainer = document.getElementById('prompt');

            document.getElementById('sendButton').addEventListener('click', () => {
                const message = input.value;
                if (message) {
                    promptContainer.innerText = "You: " + input.value;
                    vscode.postMessage({ command: 'sendMessage', text: message });
                    input.value = '';
                }
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    document.getElementById('sendButton').click();
                }
            });

            document.getElementById('userInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    document.getElementById('sendButton').click();
                }
            });

            window.addEventListener('message', event => {
                const { command, text } = event.data;

                if (command === 'messageResponse') {
                    let responseContainer = document.getElementById('response');
                    responseContainer.innerText = text;
                    responseContainer.scrollIntoView({ behavior: 'smooth' });
                }
            });
        </script>
    </body>
    </html>`;
}

export function deactivate() {} // This method is called when your extension is deactivated