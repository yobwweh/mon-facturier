const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const db = require('./database.cjs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    // Icône pour Windows/Linux (Ignoré par le Dock Mac)
    icon: path.join(__dirname, '../public/favicon.ico'), 
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.setMenu(null);
  win.maximize();

  // --- SPECIAL MAC : FORCER L'ICÔNE DU DOCK ---
  if (process.platform === 'darwin') {
    // On force l'icône du Dock à utiliser icon.icns
    const iconPath = path.join(__dirname, '../public/icon.icns');
    app.dock.setIcon(iconPath);
  }
  // --------------------------------------------

  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  // --- BLOC DE SÉCURITÉ BDD ---
  try {
    db.initDatabase();
  } catch (error) {
    dialog.showErrorBox("Erreur Démarrage", `Erreur BDD: ${error.message}`);
    app.quit();
    return;
  }

  // --- IPC HANDLERS ---
  // Clients
  ipcMain.handle('get-clients', () => db.getClients());
  ipcMain.handle('add-client', (event, client) => db.addClient(client));
  ipcMain.handle('delete-client', (event, id) => db.deleteClient(id));

  // Produits
  ipcMain.handle('get-products', () => db.getProducts());
  ipcMain.handle('add-product', (event, product) => db.addProduct(product));
  ipcMain.handle('delete-product', (event, id) => db.deleteProduct(id));

  // Documents
  ipcMain.handle('get-documents', () => db.getDocuments());
  ipcMain.handle('save-document', (event, doc) => db.saveDocument(doc));
  ipcMain.handle('delete-document', (event, docId) => db.deleteDocument(docId));

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});