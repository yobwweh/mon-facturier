const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

let db;

function initDatabase() {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'facturier-ci.db');
  db = new Database(dbPath);

  // 1. Table CLIENTS (Mise à jour avec NCC et Ville)
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE,
      nom TEXT NOT NULL,
      ncc TEXT, 
      email TEXT,
      telephone TEXT,
      adresse TEXT,
      ville TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Table PRODUITS (Nouvelle)
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      price REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Table DOCUMENTS
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      docId INTEGER UNIQUE, 
      type TEXT,
      number TEXT,
      date TEXT,
      client_name TEXT,
      total REAL,
      status TEXT,
      content TEXT, 
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  console.log("✅ Base de données chargée : " + dbPath);
}

// --- CLIENTS ---
function getClients() {
  return db.prepare('SELECT * FROM clients ORDER BY nom ASC').all();
}

function addClient(client) {
  const stmt = db.prepare(`
    INSERT INTO clients (uuid, nom, ncc, email, telephone, adresse, ville)
    VALUES (@uuid, @nom, @ncc, @email, @telephone, @adresse, @ville)
  `);
  return stmt.run(client);
}

function deleteClient(id) {
  // Accepte soit l'ID (integer), soit l'UUID (string)
  if (typeof id === 'string') {
      return db.prepare('DELETE FROM clients WHERE uuid = @id').run({ id });
  }
  return db.prepare('DELETE FROM clients WHERE id = @id').run({ id });
}

// --- PRODUITS (NOUVEAU) ---
function getProducts() {
  return db.prepare('SELECT * FROM products ORDER BY description ASC').all();
}

function addProduct(product) {
  const stmt = db.prepare('INSERT INTO products (description, price) VALUES (@description, @price)');
  return stmt.run(product);
}

function deleteProduct(id) {
  return db.prepare('DELETE FROM products WHERE id = @id').run({ id });
}

// --- DOCUMENTS ---
function getDocuments() {
  const rows = db.prepare('SELECT content FROM documents ORDER BY date DESC, id DESC').all();
  return rows.map(row => JSON.parse(row.content));
}

function saveDocument(doc) {
  const subtotal = doc.items ? doc.items.reduce((acc, item) => acc + (item.quantity * item.price), 0) : 0;
  const tax = doc.hasTax ? (subtotal * doc.taxRate) / 100 : 0;
  const total = subtotal + tax;

  const stmt = db.prepare(`
    INSERT INTO documents (docId, type, number, date, client_name, total, status, content, updated_at)
    VALUES (@docId, @type, @number, @date, @client_name, @total, @status, @content, CURRENT_TIMESTAMP)
    ON CONFLICT(docId) DO UPDATE SET
      type=excluded.type,
      number=excluded.number,
      date=excluded.date,
      client_name=excluded.client_name,
      total=excluded.total,
      status=excluded.status,
      content=excluded.content,
      updated_at=CURRENT_TIMESTAMP
  `);

  return stmt.run({
    docId: doc.docId,
    type: doc.type,
    number: doc.number,
    date: doc.date,
    client_name: doc.recipient?.name || 'Inconnu',
    total: total,
    status: doc.status,
    content: JSON.stringify(doc)
  });
}

function deleteDocument(docId) {
  return db.prepare('DELETE FROM documents WHERE docId = @docId').run({ docId });
}

module.exports = {
  initDatabase,
  getClients, addClient, deleteClient,
  getProducts, addProduct, deleteProduct,
  getDocuments, saveDocument, deleteDocument
};