import React, { useState, useEffect } from 'react';
import { CheckCircle, FolderOpen, Users, LayoutDashboard, Settings, Package, Moon, Sun } from 'lucide-react';

// --- IMPORT DU MOTEUR PDF ---
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from './components/InvoicePDF';

import HistoryView from './components/HistoryView';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import ClientList from './components/ClientList';
import DashboardView from './components/DashboardView';
import SettingsView from './components/SettingsView';
import ProductList from './components/ProductList';
import SplashView from './components/SplashView';
import { storage } from './services/storage';

export default function App() {
  // --- ÉTATS ---
  const [view, setView] = useState('editor'); 
  const [savedDocuments, setSavedDocuments] = useState([]); 
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]); 
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  
  // État de chargement pour le bouton PDF
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Thème
  const [theme, setTheme] = useState('winter');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(curr => curr === 'winter' ? 'night' : 'winter');

  const getLocalDate = () => {
    const d = new Date();
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
  };

  // --- FACTURE ---
  const [invoice, setInvoice] = useState({
    docId: null, type: 'FACTURE', number: '', status: 'PENDING', 
    date: getLocalDate(), 
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    hasTax: true, taxRate: 18, 
    sender: { name: '', legalForm: '', capital: '', address: '', zip: '', city: '', email: '', phone: '', ncc: '', rccm: '', logo: null },
    recipient: { name: '', ncc: '', address: '', city: '', email: '', phone: '' },
    items: [ { id: 1, description: '', quantity: 1, price: 0 } ],
    paymentMethod: 'Virement', mobileMoneyInfo: '',
    receiptReference: '', receiptReason: '', receiptAmount: '', receiptQrCode: null,
    notes: ''
  });

  // --- CHARGEMENT ---
  const refreshDocumentsList = async () => {
      if (window.electronAPI) {
          const docs = await window.electronAPI.getDocuments();
          setSavedDocuments(docs);
      } else {
          const docs = await storage.get('invoiceDB') || [];
          setSavedDocuments(docs);
      }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    const initData = async () => {
        try {
            if (window.electronAPI) {
                // --- CHARGEMENT VIA ELECTRON ---
                const dbClients = await window.electronAPI.getClients();
                setClients(dbClients);
                
                const dbDocs = await window.electronAPI.getDocuments();
                setSavedDocuments(dbDocs);

                const dbProducts = await window.electronAPI.getProducts();
                setProducts(dbProducts);
            } else {
                // --- MODE WEB (Fallback) ---
                const dbClients = await storage.get('clientDB') || [];
                setClients(dbClients);
                
                const docs = await storage.get('invoiceDB') || [];
                setSavedDocuments(docs);
                
                const prod = await storage.get('productDB') || [];
                setProducts(prod);
            }
            
            const draft = await storage.get('currentDraft');
            if (draft) setInvoice(draft);
            else {
                const profile = await storage.get('companyProfile');
                const defaultSender = profile || invoice.sender;
                const nextNum = generateNextNumber('FACTURE', savedDocuments); 
                setInvoice(prev => ({ ...prev, docId: Date.now(), type: 'FACTURE', number: nextNum, sender: defaultSender }));
            }
        } catch (e) { console.error("Erreur Init:", e); }
        setAppReady(true);
    };
    initData();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!appReady) return;
    const autoSaveTimer = setTimeout(() => { storage.save('currentDraft', invoice); }, 1000);
    return () => clearTimeout(autoSaveTimer);
  }, [invoice, appReady]);

  useEffect(() => {
      if(savedDocuments.length > 0 && invoice.number === '') refreshNumber();
  }, [savedDocuments]);

  // --- LOGIQUE MÉTIER ---
  const generateNextNumber = (type, docsList = savedDocuments) => {
      const prefixMap = { 'FACTURE': 'FAC', 'DEVIS': 'DEV', 'RECU': 'REC' };
      const prefix = prefixMap[type] || 'DOC';
      const year = new Date().getFullYear();
      const pattern = `${prefix}-${year}-`;
      const relevantDocs = docsList.filter(d => d.type === type && d.number && d.number.startsWith(pattern));
      
      if (relevantDocs.length === 0) return `${pattern}000001`;
      
      const existingNumbers = relevantDocs.map(d => parseInt(d.number.split('-').pop())).filter(n => !isNaN(n));
      const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
      
      return `${pattern}${(maxNum + 1).toString().padStart(6, '0')}`;
  };

  const formatMoney = (amount) => new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount).replace('XOF', 'FCFA');

  const handleSave = async () => {
    let newDocId = invoice.docId || Date.now();
    const docToSave = { ...invoice, docId: newDocId, lastModified: new Date().toISOString() };
    setInvoice(docToSave);

    if (window.electronAPI) {
        try { await window.electronAPI.saveDocument(docToSave); await refreshDocumentsList(); setShowSavedMessage(true); } 
        catch (err) { console.error("Erreur Save DB", err); }
    } else {
        const updatedDocs = [...savedDocuments];
        const existingIndex = updatedDocs.findIndex(d => d.docId === newDocId);
        if (existingIndex >= 0) updatedDocs[existingIndex] = docToSave; else updatedDocs.push(docToSave); 
        setSavedDocuments(updatedDocs); await storage.save('invoiceDB', updatedDocs); setShowSavedMessage(true);
    }
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  // --- FONCTION PDF ---
  const handleDownload = async () => {
    try {
        setIsGeneratingPdf(true);
        await handleSave(); // Sauvegarder d'abord

        const fileName = `${invoice.type}_${invoice.number}.pdf`;
        const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Erreur PDF:", error);
        alert("Erreur PDF : " + error.message);
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  // --- ACTIONS ---
  const handleNew = async () => {
    if (confirm("Créer un nouveau document vierge ?")) {
        const savedProfile = await storage.get('companyProfile');
        const defaultSender = savedProfile || { name: '', legalForm: '', capital: '', address: '', zip: '', city: '', email: '', phone: '', ncc: '', rccm: '', logo: null };
        const nextNum = generateNextNumber('FACTURE');
        
        setInvoice({
            docId: Date.now(), type: 'FACTURE', number: nextNum, status: 'PENDING',
            date: getLocalDate(), dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            hasTax: true, taxRate: 18, sender: defaultSender, 
            recipient: { name: '', ncc: '', address: '', city: '', email: '', phone: '' },
            items: [{ id: 1, description: '', quantity: 1, price: 0 }],
            paymentMethod: 'Virement', mobileMoneyInfo: '',
            receiptReference: '', receiptReason: '', receiptAmount: '', receiptQrCode: null,
            notes: 'Arrêté la présente facture à la somme indiquée ci-dessous.'
        });
        setView('editor');
    }
  };

  const loadDocument = (doc) => { setInvoice(doc); setView('editor'); };
  
  const deleteDocument = async (id, e) => { 
      e.stopPropagation(); 
      if (confirm("Supprimer ?")) { 
          if(window.electronAPI) { await window.electronAPI.deleteDocument(id); await refreshDocumentsList(); } 
          else { const updated = savedDocuments.filter(d => d.docId !== id); setSavedDocuments(updated); await storage.save('invoiceDB', updated); }
          if (invoice.docId === id) handleNew(); 
      } 
  };
  
  const toggleDocStatus = async (id, e) => { 
      e.stopPropagation(); 
      const doc = savedDocuments.find(d => d.docId === id);
      if (!doc) return;
      const newStatus = doc.status === 'PAID' ? 'PENDING' : 'PAID';
      const updatedDoc = { ...doc, status: newStatus };
      if (window.electronAPI) { await window.electronAPI.saveDocument(updatedDoc); await refreshDocumentsList(); } 
      else { const updated = savedDocuments.map(d => d.docId === id ? updatedDoc : d); setSavedDocuments(updated); await storage.save('invoiceDB', updated); }
      if (invoice.docId === id) setInvoice(prev => ({ ...prev, status: newStatus }));
  };

  const convertToInvoice = async (doc, e) => { 
      e.stopPropagation(); 
      if(confirm(`Convertir en Facture ?`)) { 
          const nextNum = generateNextNumber('FACTURE'); 
          setInvoice({ ...doc, docId: Date.now(), type: 'FACTURE', number: nextNum, date: getLocalDate(), status: 'PENDING' }); 
          setView('editor'); 
      } 
  };

  const handleProfileUpdate = (newProfile) => {
      setInvoice(prev => ({ ...prev, sender: newProfile }));
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const handleLogoUpload = (e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setInvoice(p => ({ ...p, sender: { ...p.sender, logo: reader.result } })); reader.readAsDataURL(file); } };
  const handleQrCodeUpload = (e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setInvoice(p => ({ ...p, receiptQrCode: reader.result })); reader.readAsDataURL(file); } };
  
  const handleTypeChange = (newType) => { 
      const nextNum = generateNextNumber(newType); 
      setInvoice(prev => ({ ...prev, type: newType, number: nextNum, hasTax: newType !== 'RECU', status: newType === 'RECU' ? 'PAID' : 'PENDING' })); 
  };
  
  const refreshNumber = () => setInvoice(p => ({...p, number: generateNextNumber(p.type)}));
  const handleExportBackup = () => { alert("Données sauvegardées."); };
  const handleImportBackup = (e) => { };

  const subtotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const taxAmount = invoice.hasTax ? (subtotal * invoice.taxRate) / 100 : 0;
  const total = subtotal + taxAmount; 

  if (showSplash || !appReady) return <SplashView />;

  // --- RENDU CONTENU ---
  const renderContent = () => {
      switch (view) {
          case 'settings': return <SettingsView setView={setView} onProfileUpdate={handleProfileUpdate} showNotification={(msg) => { setShowSavedMessage(true); setTimeout(() => setShowSavedMessage(false), 3000); alert(msg); }} />;
          case 'clients': return <ClientList clients={clients} setClients={setClients} setView={setView} />;
          case 'products': return <ProductList products={products} setProducts={setProducts} setView={setView} formatMoney={formatMoney} />;
          case 'dashboard': return <DashboardView savedDocuments={savedDocuments} clients={clients} formatMoney={formatMoney} setView={setView} />;
          case 'history': return <HistoryView savedDocuments={savedDocuments} setView={setView} handleExportBackup={handleExportBackup} handleImportBackup={handleImportBackup} loadDocument={loadDocument} deleteDocument={deleteDocument} toggleDocStatus={toggleDocStatus} formatMoney={formatMoney} convertToInvoice={convertToInvoice} />;
          default: 
              return (
                  <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                    <div className="w-full lg:w-5/12 h-full overflow-y-auto">
                        <InvoiceForm 
                            invoice={invoice} setInvoice={setInvoice} handleTypeChange={handleTypeChange}
                            refreshNumber={refreshNumber} handleLogoUpload={handleLogoUpload}
                            handleQrCodeUpload={handleQrCodeUpload} clients={clients} products={products}
                        />
                    </div>
                    <div className="w-full lg:w-7/12 h-full bg-base-300 overflow-y-auto flex justify-center items-start">
                        <InvoicePreview invoice={invoice} formatMoney={formatMoney} subtotal={subtotal} taxAmount={taxAmount} total={total} />
                    </div>
                  </div>
              );
      }
  };

  return (
    <div className="h-screen flex flex-col bg-base-100 font-sans text-base-content overflow-hidden">
      <div className="navbar bg-base-100 shadow-md z-50 px-4 border-b border-base-200">
        <div className="flex-1 gap-3">
            <div className="w-10 h-10 bg-primary text-primary-content rounded-xl flex items-center justify-center shadow-lg cursor-pointer" onClick={() => setView('editor')}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-base-content cursor-pointer" onClick={() => setView('editor')}>Facturier CI</h1>
              <span className="badge bg-green-600 text-white border-none badge-xs">Base de Données Active</span>
            </div>
        </div>
        <div className="flex-none hidden md:flex mx-4">
            <div className="flex gap-1 bg-base-200 p-1 rounded-lg">
                {[
                    { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau' },
                    { id: 'clients', icon: Users, label: 'Clients' },
                    { id: 'products', icon: Package, label: 'Catalogue' },
                    { id: 'history', icon: FolderOpen, label: 'Documents' }
                ].map(item => (
                    <button key={item.id} onClick={() => setView(item.id)} className={`btn btn-sm border-none gap-2 ${view === item.id ? 'bg-base-100 text-primary shadow-sm font-extrabold' : 'btn-ghost text-base-content/70 hover:text-base-content hover:bg-base-200'}`}>
                        <item.icon className="w-4 h-4" /> {item.label}
                    </button>
                ))}
            </div>
        </div>
        <div className="flex-none gap-2">
            {showSavedMessage && <div className="badge badge-success gap-2 text-white animate-pulse"><CheckCircle className="w-3 h-3" /> Sauvé</div>}
            <button onClick={toggleTheme} className="btn btn-sm btn-circle btn-ghost" title="Changer Thème">{theme === 'winter' ? <Moon className="w-5 h-5 text-base-content" /> : <Sun className="w-5 h-5 text-warning" />}</button>
            {view === 'editor' && (
                <>
                    <button onClick={handleNew} className="btn btn-sm btn-ghost border-base-300 text-base-content">Nouveau</button>
                    <button onClick={handleSave} className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white font-bold border-none">Sauver</button>
                    <button onClick={handleDownload} disabled={isGeneratingPdf} className="btn btn-sm bg-red-600 hover:bg-red-700 text-white font-bold border-none">
                        {isGeneratingPdf ? "..." : "PDF"}
                    </button>
                </>
            )}
            <button onClick={() => setView('settings')} className={`btn btn-sm btn-circle btn-ghost ${view === 'settings' ? 'bg-base-200 text-primary' : 'text-base-content'}`}><Settings className="w-5 h-5" /></button>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}