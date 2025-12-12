import React from 'react';
import { FileText, RefreshCw, Upload, Building2, User, Calculator, Plus, Trash2, CreditCard, Smartphone, QrCode, Lock } from 'lucide-react';

export default function InvoiceForm({ invoice, setInvoice, handleTypeChange, refreshNumber, handleLogoUpload, handleQrCodeUpload, clients = [], products = [] }) {
  
  const updateSender = (field, value) => setInvoice(p => ({...p, sender: {...p.sender, [field]: value}}));
  const updateRecipient = (field, value) => setInvoice(p => ({...p, recipient: {...p.recipient, [field]: value}}));

  const handleItemChange = (id, field, value) => {
    setInvoice(prev => {
        const newItems = prev.items.map(item => {
            if (item.id !== id) return item;
            let updatedItem = { ...item, [field]: value };
            if (field === 'description') {
                const foundProduct = products.find(p => p.description.toLowerCase() === value.toLowerCase());
                if (foundProduct) updatedItem.price = foundProduct.price;
            }
            return updatedItem;
        });
        return { ...prev, items: newItems };
    });
  };

  const handleSelectClient = (e) => {
      const selectedValue = e.target.value;
      if(!selectedValue) return;

      const client = clients.find(c => c.id == selectedValue || c.uuid == selectedValue);
      
      if(client) {
          setInvoice(p => ({
              ...p, recipient: { 
                  ...p.recipient, 
                  name: client.nom || client.name || '',
                  ncc: client.ncc || '', 
                  address: client.adresse || client.address || '', 
                  city: client.ville || client.city || '', 
                  email: client.email || '', 
                  phone: client.telephone || client.phone || '' 
              }
          }));
      }
  };

  const formatMoneyForOption = (amount) => new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount).replace('XOF', 'FCFA');

  const toggleStatus = () => {
      if (invoice.type === 'RECU') return;
      setInvoice(p => ({...p, status: p.status === 'PAID' ? 'PENDING' : 'PAID'}));
  };

  return (
    // --- CORRECTION ICI : Remplacement de 'lg:w-5/12' par 'w-full' ---
    <div className="no-print w-full h-full overflow-y-auto bg-base-100 border-r border-base-300 z-10 pb-20 p-6 space-y-6 text-base-content">
        
        {/* TYPE & NUMERO */}
        <div className="card bg-base-100 shadow-sm border border-base-200 card-compact">
           <div className="card-body">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <h3 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Document
                  </h3>
                  
                  <div className="join border border-base-300 shadow-sm">
                    {['FACTURE', 'DEVIS', 'RECU'].map(type => (
                      <button 
                        key={type} 
                        onClick={() => handleTypeChange(type)} 
                        className={`join-item btn btn-sm no-animation font-bold border-none ${
                            invoice.type === type 
                            ? 'btn-primary text-white' 
                            : 'btn-ghost bg-base-100 text-base-content/70 hover:bg-base-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="form-control">
                    <label className="label"><span className="label-text font-bold text-base-content">Numéro</span></label>
                    <div className="join w-full">
                        <input type="text" value={invoice.number} onChange={(e) => setInvoice({...invoice, number: e.target.value})} className="join-item input input-bordered input-sm w-full font-mono bg-base-100 text-base-content focus:input-primary" />
                        <button onClick={refreshNumber} className="join-item btn btn-sm btn-square border-base-300 bg-base-200 text-base-content"><RefreshCw className="w-4 h-4" /></button>
                    </div>
                 </div>
                 <div className="form-control">
                    <label className="label"><span className="label-text font-bold text-base-content">Date</span></label>
                    <input type="date" value={invoice.date} onChange={(e) => setInvoice({...invoice, date: e.target.value})} className="input input-bordered input-sm w-full bg-base-100 text-base-content focus:input-primary" />
                 </div>
               </div>
           </div>
        </div>

        {/* VENDEUR */}
        <div className="card bg-base-100 shadow-sm border border-base-200 card-compact">
            <div className="card-body">
                <h3 className="card-title text-sm font-bold text-base-content uppercase flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Émetteur
                </h3>
                
                <div className="flex items-center gap-4 mb-2">
                  <div className="avatar placeholder">
                    <div className="bg-base-200 text-base-content/50 rounded-xl w-16 h-16 relative group cursor-pointer border border-base-300 hover:border-primary transition-colors flex items-center justify-center">
                        {invoice.sender.logo ? <img src={invoice.sender.logo} alt="Logo" className="object-contain" /> : <Upload className="w-6 h-6 opacity-50" />}
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex-1">
                      <p className="text-sm font-bold text-base-content">Logo Entreprise</p>
                      <p className="text-xs text-base-content/60">Cliquez sur le carré pour changer.</p>
                  </div>
                </div>

                <div className="form-control w-full">
                    <label className="label py-1"><span className="label-text font-bold text-base-content">Raison Sociale</span></label>
                    <input type="text" value={invoice.sender.name} onChange={(e) => updateSender('name', e.target.value)} className="input input-bordered input-sm w-full font-bold bg-base-100 text-base-content focus:input-primary" placeholder="Votre Raison Sociale" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="form-control">
                        <label className="label py-1"><span className="label-text font-bold text-base-content">Forme</span></label>
                        <input type="text" value={invoice.sender.legalForm} onChange={(e) => updateSender('legalForm', e.target.value)} className="input input-bordered input-sm w-full bg-base-100 text-base-content" placeholder="Ex: SARL" />
                    </div>
                    <div className="form-control">
                        <label className="label py-1"><span className="label-text font-bold text-base-content">Capital</span></label>
                        <input type="text" value={invoice.sender.capital} onChange={(e) => updateSender('capital', e.target.value)} className="input input-bordered input-sm w-full bg-base-100 text-base-content" placeholder="1 000 000" />
                    </div>
                </div>
                
                <div className="collapse collapse-arrow bg-base-200/40 border border-base-200 mt-2 rounded-lg">
                    <input type="checkbox" /> 
                    <div className="collapse-title text-xs font-bold uppercase py-3 min-h-0 text-base-content">Fiscalité & Contact</div>
                    <div className="collapse-content text-xs space-y-2"> 
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <input type="text" placeholder="NCC" value={invoice.sender.ncc} onChange={(e) => updateSender('ncc', e.target.value)} className="input input-bordered input-xs w-full bg-base-100 text-base-content" />
                            <input type="text" placeholder="RCCM" value={invoice.sender.rccm} onChange={(e) => updateSender('rccm', e.target.value)} className="input input-bordered input-xs w-full bg-base-100 text-base-content" />
                        </div>
                        <input type="text" placeholder="Adresse complète" value={invoice.sender.address} onChange={(e) => updateSender('address', e.target.value)} className="input input-bordered input-xs w-full bg-base-100 text-base-content" />
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Téléphone" value={invoice.sender.phone} onChange={(e) => updateSender('phone', e.target.value)} className="input input-bordered input-xs w-full bg-base-100 text-base-content" />
                            <input type="text" placeholder="Email" value={invoice.sender.email} onChange={(e) => updateSender('email', e.target.value)} className="input input-bordered input-xs w-full bg-base-100 text-base-content" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* CLIENT */}
        <div className="card bg-base-100 shadow-sm border border-base-200 card-compact border-l-4 border-l-primary">
            <div className="card-body">
                <h3 className="card-title text-sm font-bold text-base-content uppercase flex items-center gap-2">
                    <User className="w-4 h-4" /> Client
                </h3>
                {clients.length > 0 && (
                     <select onChange={handleSelectClient} className="select select-bordered select-xs w-full mb-3 text-base-content font-bold bg-base-100">
                         <option value="">-- Sélection rapide d'un client --</option>
                         {clients.map(c => <option key={c.id || c.uuid} value={c.id || c.uuid}>{c.nom || c.name}</option>)}
                     </select>
                )}
                <div className="form-control">
                    <label className="label py-1"><span className="label-text font-bold text-base-content">Nom du client</span></label>
                    <input type="text" value={invoice.recipient.name} onChange={(e) => updateRecipient('name', e.target.value)} className="input input-bordered input-sm w-full font-bold bg-base-100 text-base-content focus:input-primary" placeholder="Nom du client" />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                     <input type="text" placeholder="Téléphone" value={invoice.recipient.phone} onChange={(e) => updateRecipient('phone', e.target.value)} className="input input-bordered input-sm w-full bg-base-100 text-base-content" />
                     <input type="text" placeholder="Email" value={invoice.recipient.email} onChange={(e) => updateRecipient('email', e.target.value)} className="input input-bordered input-sm w-full bg-base-100 text-base-content" />
                </div>
                {invoice.type !== 'RECU' && <input type="text" placeholder="NCC Client" value={invoice.recipient.ncc} onChange={(e) => updateRecipient('ncc', e.target.value)} className="input input-bordered input-sm w-full mt-2 bg-base-100 text-base-content" />}
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <input type="text" placeholder="Ville" value={invoice.recipient.city} onChange={(e) => updateRecipient('city', e.target.value)} className="input input-bordered input-sm w-full bg-base-100 text-base-content" />
                    <input type="text" placeholder="Adresse" value={invoice.recipient.address} onChange={(e) => updateRecipient('address', e.target.value)} className="input input-bordered input-sm w-full bg-base-100 text-base-content" />
                </div>
            </div>
        </div>

        {/* ARTICLES */}
        {invoice.type !== 'RECU' && (
            <div className="card bg-base-100 shadow-sm border border-base-200 card-compact">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                        <Calculator className="w-4 h-4" /> Articles
                    </h3>
                    <button onClick={() => setInvoice(p => ({...p, items: [...p.items, { id: Date.now(), description: '', quantity: 1, price: 0 }]}))} className="btn btn-xs btn-neutral"><Plus className="w-3 h-3" /> Ajouter</button>
                </div>

                <datalist id="products-list">
                    {products.map(p => <option key={p.id} value={p.description}>{formatMoneyForOption(p.price)}</option>)}
                </datalist>

                <div className="space-y-3">
                  {invoice.items.map((item) => (
                    <div key={item.id} className="flex gap-2 items-start bg-base-200/40 p-2 rounded-lg border border-base-200 group hover:border-primary/50 transition-colors">
                      <div className="flex-grow grid gap-2">
                        <input type="text" list="products-list" value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} className="input input-bordered input-sm w-full font-medium bg-base-100 text-base-content" placeholder="Description" autoComplete="off" />
                        <div className="flex gap-2">
                          <input type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value))} className="input input-bordered input-sm w-20 text-center bg-base-100 text-base-content" placeholder="Qté" />
                          <input type="number" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value))} className="input input-bordered input-sm flex-1 text-right bg-base-100 text-base-content" placeholder="Prix" />
                        </div>
                      </div>
                      <button onClick={() => setInvoice(p => ({...p, items: p.items.filter(i => i.id !== item.id)}))} className="btn btn-ghost btn-sm btn-square text-error mt-4"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-base-200 flex justify-between items-center">
                    <div className="form-control">
                        <label className="label cursor-pointer gap-2">
                            <input type="checkbox" className="toggle toggle-primary toggle-sm" checked={invoice.hasTax} onChange={() => setInvoice({...invoice, hasTax: !invoice.hasTax})} />
                            <span className="label-text font-bold text-base-content">Appliquer TVA</span>
                        </label>
                    </div>
                    {invoice.hasTax && (
                        <div className="flex items-center gap-2">
                            <input type="number" value={invoice.taxRate} onChange={(e) => setInvoice({...invoice, taxRate: parseFloat(e.target.value)})} className="input input-bordered input-sm w-16 text-right bg-base-100 text-base-content" />
                            <span className="text-sm font-bold">%</span>
                        </div>
                    )}
                </div>
              </div>
            </div>
        )}

         {/* PAIEMENT & DETAILS */}
         <div className="card bg-base-100 shadow-sm border border-base-200 card-compact mb-10">
            <div className="card-body">
                <h3 className="text-sm font-bold text-base-content uppercase mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Paiement
                </h3>
                
                <div className="flex items-center justify-between bg-base-200/50 p-3 rounded-lg mb-4 border border-base-200">
                    <span className="text-xs font-bold text-base-content">Statut du document</span>
                    <div 
                        onClick={toggleStatus} 
                        className={`badge gap-2 p-3 font-bold select-none shadow-sm 
                        ${invoice.status === 'PAID' 
                            ? 'bg-green-600 text-white border-green-700' 
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'}
                        ${invoice.type === 'RECU' ? 'cursor-default opacity-100' : 'cursor-pointer hover:scale-105 transition-transform'}`}
                    >
                        {invoice.status === 'PAID' ? 'PAYÉ' : 'EN ATTENTE'}
                        {invoice.type === 'RECU' && <Lock className="w-3 h-3 opacity-70" />}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="form-control">
                        <label className="label py-1"><span className="label-text font-bold text-base-content">Mode</span></label>
                        <select value={invoice.paymentMethod} onChange={(e) => setInvoice({...invoice, paymentMethod: e.target.value})} className="select select-bordered select-sm w-full bg-base-100 text-base-content">
                            <option value="Virement">Virement Bancaire</option><option value="Chèque">Chèque</option><option value="Espèces">Espèces</option><option value="Mobile Money">Mobile Money</option>
                        </select>
                    </div>
                    {invoice.type !== 'RECU' && (
                        <div className="form-control">
                            <label className="label py-1"><span className="label-text font-bold text-base-content">Échéance</span></label>
                            <input type="date" value={invoice.dueDate} onChange={(e) => setInvoice({...invoice, dueDate: e.target.value})} className="input input-bordered input-sm w-full bg-base-100 text-base-content" />
                        </div>
                    )}
                </div>
                
                {invoice.type !== 'RECU' && (
                    <div className="form-control mt-2">
                        <label className="label py-1"><span className="label-text font-bold text-green-700 uppercase">Acompte Perçu</span></label>
                        <div className="relative">
                            <input type="number" placeholder="0" value={invoice.advance || ''} onChange={(e) => setInvoice({...invoice, advance: parseFloat(e.target.value) || 0})} className="input input-bordered input-sm w-full font-bold text-green-700 border-green-500 bg-base-100 placeholder-green-700/30" />
                            <span className="absolute right-3 top-1.5 text-xs font-bold text-green-700">FCFA</span>
                        </div>
                    </div>
                )}

                {invoice.paymentMethod === 'Mobile Money' && (
                    <div className="form-control mt-2">
                        <label className="label py-1"><span className="label-text font-bold text-primary flex gap-1 items-center"><Smartphone className="w-3 h-3" /> Info Mobile Money</span></label>
                        <input type="text" placeholder="Ex: Orange: 07.. / Wave: 05.." value={invoice.mobileMoneyInfo} onChange={(e) => setInvoice({...invoice, mobileMoneyInfo: e.target.value})} className="input input-bordered input-primary input-sm w-full bg-base-100 text-base-content" />
                    </div>
                )}
                
                {invoice.type === 'RECU' && (
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 space-y-3 mt-2">
                        <div className="text-center">
                             <p className="text-xs font-bold text-primary mb-2 flex justify-center items-center gap-1"><QrCode className="w-3 h-3" /> QR Code</p>
                             <div className="w-24 h-24 mx-auto border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center relative cursor-pointer hover:border-primary bg-base-100">
                                {invoice.receiptQrCode ? <img src={invoice.receiptQrCode} className="w-full h-full object-contain" alt="QR" /> : <Upload className="w-6 h-6 text-primary/40" />}
                                <input type="file" accept="image/*" onChange={handleQrCodeUpload} className="absolute inset-0 opacity-0" />
                             </div>
                        </div>
                        <div className="form-control">
                            <input type="text" placeholder="Référence paiement" value={invoice.receiptReference} onChange={(e) => setInvoice({...invoice, receiptReference: e.target.value})} className="input input-bordered input-xs w-full mb-2 bg-base-100 text-base-content" />
                            <input type="text" placeholder="Motif du paiement" value={invoice.receiptReason} onChange={(e) => setInvoice({...invoice, receiptReason: e.target.value})} className="input input-bordered input-xs w-full mb-2 bg-base-100 text-base-content" />
                            <input type="text" placeholder="Montant Payé (FCFA)" value={invoice.receiptAmount} onChange={(e) => setInvoice({...invoice, receiptAmount: e.target.value})} className="input input-bordered input-sm font-bold text-primary w-full bg-base-100" />
                        </div>
                    </div>
                )}

                <div className="form-control mt-4">
                    <label className="label py-1"><span className="label-text font-bold text-base-content">Notes / Arrêté</span></label>
                    <textarea value={invoice.notes} onChange={(e) => setInvoice({...invoice, notes: e.target.value})} className="textarea textarea-bordered h-20 text-xs bg-base-100 text-base-content" />
                </div>
            </div>
         </div>
    </div>
  );
}