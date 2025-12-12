const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./database.cjs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    autoHideMenuBar: true, // Cache la barre de menu native
    // On peut ajouter l'icône ici si elle est dans public
    icon: path.join(__dirname, '../public/favicon.ico'), 
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Masquer totalement le menu
  win.setMenu(null);

  // --- MODIFICATION ICI : Démarrer en plein écran (Maximized) ---
  win.maximize();
  // ------------------------------------------------------------

  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  // Initialisation de la BDD
  db.initDatabase();

  // --- CLIENTS ---
  ipcMain.handle('get-clients', () => db.getClients());
  ipcMain.handle('add-client', (event, client) => db.addClient(client));
  ipcMain.handle('delete-client', (event, id) => db.deleteClient(id));

  // --- PRODUITS ---
  ipcMain.handle('get-products', () => db.getProducts());
  ipcMain.handle('add-product', (event, product) => db.addProduct(product));
  ipcMain.handle('delete-product', (event, id) => db.deleteProduct(id));

  // --- DOCUMENTS ---
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