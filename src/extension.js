const vscode = require('vscode');
const { getWebviewContent } = require('./webviewContent');

/**
 * @type {vscode.WebviewPanel | undefined}
 */
let currentPanel = undefined;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Status bar icon on the top / right status bar
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    1000
  );
  statusBarItem.command = 'clauding.openGame';
  statusBarItem.text = '$(game) Clauding';
  statusBarItem.tooltip = 'Clauding: Play games while Claude is running tasks!';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // Command to open webview
  const disposable = vscode.commands.registerCommand('clauding.openGame', () => {
    // If panel exists, reveal it in the beside column (right side)
    if (currentPanel) {
      currentPanel.reveal(vscode.ViewColumn.Beside);
      return;
    }

    currentPanel = vscode.window.createWebviewPanel(
      'claudingGames',
      'Clauding Games',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    currentPanel.iconPath = new vscode.ThemeIcon('game');
    currentPanel.webview.html = getWebviewContent();

    currentPanel.onDidDispose(() => {
      currentPanel = undefined;
    }, null, context.subscriptions);
  });

  const resetDisposable = vscode.commands.registerCommand('clauding.resetData', () => {
    if (currentPanel) {
      currentPanel.webview.postMessage({ command: 'resetClaudingData' });
    }
    vscode.window.showInformationMessage('Clauding: Local storage, gamer tag, and high scores have been reset.');
  });

  context.subscriptions.push(disposable, resetDisposable);
}

function deactivate() {
  if (currentPanel) {
    currentPanel.dispose();
  }
}

module.exports = {
  activate,
  deactivate
};
