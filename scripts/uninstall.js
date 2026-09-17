const fs = require('fs');
const path = require('path');
const os = require('os');

function cleanStorage() {
  try {
    const homedir = os.homedir();
    const storagePaths = [
      // VS Code
      path.join(homedir, 'Library/Application Support/Code/User/globalStorage/pathik455.clauding'),
      path.join(homedir, '.vscode/extensions/pathik455.clauding*'),
      // VS Code Insiders
      path.join(homedir, 'Library/Application Support/Code - Insiders/User/globalStorage/pathik455.clauding'),
      path.join(homedir, '.vscode-insiders/extensions/pathik455.clauding*'),
      // Linux paths
      path.join(homedir, '.config/Code/User/globalStorage/pathik455.clauding'),
      // Windows APPDATA paths
      process.env.APPDATA ? path.join(process.env.APPDATA, 'Code/User/globalStorage/pathik455.clauding') : null
    ].filter(Boolean);

    storagePaths.forEach(p => {
      try {
        if (fs.existsSync(p)) {
          fs.rmSync(p, { recursive: true, force: true });
        }
      } catch (err) {}
    });
  } catch (e) {}
}

cleanStorage();
