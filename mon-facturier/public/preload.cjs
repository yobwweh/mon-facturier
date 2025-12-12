const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // --- CLIENTS ---
  getClients: () => ipcRenderer.invoke('get-clients'),
  addClient: (clientData) => ipcRenderer.invoke('add-client', clientData),
  deleteClient: (id) => ipcRenderer.invoke('delete-client', id),

  // --- PRODUITS (Ajouté) ---
  getProducts: () => ipcRenderer.invoke('get-products'),
  addProduct: (productData) => ipcRenderer.invoke('add-product', productData),
  deleteProduct: (id) => ipcRenderer.invoke('delete-product', id),

  // --- DOCUMENTS ---
  getDocuments: () => ipcRenderer.invoke('get-documents'),
  saveDocument: (doc) => ipcRenderer.invoke('save-document', doc),
  deleteDocument: (docId) => ipcRenderer.invoke('delete-document', docId)
});