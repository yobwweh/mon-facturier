import React from 'react';
import { FolderOpen, Download, FileUp, ArrowLeft, Trash2, CheckSquare, Square, RefreshCcw, Lock } from 'lucide-react';

export default function HistoryView({ savedDocuments, setView, handleExportBackup, handleImportBackup, loadDocument, deleteDocument, toggleDocStatus, formatMoney, convertToInvoice }) {
  
  const getDocAmount = (doc) => {
      if (doc.type === 'RECU') return parseFloat(doc.receiptAmount) || 0;
      const subtotal = doc.items.reduce((acc, item) => acc + (parseFloat(item.quantity || 0) * parseFloat(item.price || 0)), 0);
      return doc.hasTax ? subtotal * (1 + parseFloat(doc.taxRate || 0)/100) : subtotal;
  };

  return (
    <div className="h-full flex flex-col bg-base-200 font-sans text-base-content">
        <div className="navbar bg-base-100 shadow-sm px-4 border-b border-base-200">
            <div className="flex-1 gap-2">
                <FolderOpen className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold text-base-content">Historique</h1>
                <span className="badge badge-neutral text-white">{savedDocuments.length}</span>
            </div>
            <div className="flex gap-2">
                <button onClick={handleExportBackup} className="btn btn-ghost btn-sm gap-2 text-base-content hover:bg-base-200">
                    <Download className="w-4 h-4" /> Sauvegarder
                </button>
                <label className="btn btn-ghost btn-sm gap-2 cursor-pointer text-base-content hover:bg-base-200">
                    <FileUp className="w-4 h-4" /> Importer
                    <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                </label>
                <div className="divider divider-horizontal mx-0"></div>
                <button onClick={() => setView('editor')} className="btn btn-primary btn-sm text-white shadow-md">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </button>
            </div>
        </div>

        <div className="p-8 max-w-6xl mx-auto w-full overflow-y-auto">
            <div className="card bg-base-100 shadow-sm overflow-hidden border border-base-200">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr className="bg-base-200/50 text-base-content/70">
                                <th>Statut</th><th>Date</th><th>Type</th><th>Numéro</th><th>Client</th><th className="text-right">Montant</th><th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {savedDocuments.length === 0 ? (
                                <tr><td colSpan="7" className="text-center p-10 opacity-50 text-base-content">Aucun document sauvegardé.</td></tr>
                            ) : (
                                savedDocuments.slice().reverse().map((doc) => {
                                    const amount = getDocAmount(doc);
                                    const isRecu = doc.type === 'RECU';
                                    const isPaid = doc.status === 'PAID';

                                    return (
                                        <tr key={doc.docId} onClick={() => loadDocument(doc)} className="hover cursor-pointer text-base-content">
                                            <td onClick={(e) => e.stopPropagation()}>
                                                {isRecu ? (
                                                    <span className="badge badge-ghost gap-1 opacity-70 bg-base-200 text-base-content"><Lock className="w-3 h-3" /> Reçu</span>
                                                ) : (
                                                    // CORRECTION: Couleurs forcées (Vert Vif / Jaune Lisible)
                                                    <button onClick={(e) => toggleDocStatus(doc.docId, e)} className={`badge gap-1 font-bold border-none py-3 ${isPaid ? 'bg-green-600 text-white' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {isPaid ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                                                        {isPaid ? 'PAYÉ' : 'ATTENTE'}
                                                    </button>
                                                )}
                                            </td>
                                            <td className="text-sm opacity-70">{new Date(doc.date).toLocaleDateString('fr-FR')}</td>
                                            
                                            <td>
                                                {/* CORRECTION: Badges de type avec couleurs forcées pour contraste */}
                                                <span className={`badge badge-sm font-bold border-none py-2.5 text-white ${
                                                    doc.type === 'FACTURE' ? 'bg-blue-600' : 
                                                    doc.type === 'RECU' ? 'bg-emerald-600' : 
                                                    'bg-gray-500' 
                                                }`}>
                                                    {doc.type}
                                                </span>
                                            </td>

                                            <td className="font-mono font-bold text-xs">{doc.number}</td>
                                            <td className="font-bold">{doc.recipient.name}</td>
                                            <td className="text-right font-mono font-bold">{formatMoney(amount)}</td>
                                            <td className="text-center" onClick={(e) => e.stopPropagation()}>
                                                <div className="join">
                                                    {doc.type === 'DEVIS' && (
                                                        <button onClick={(e) => convertToInvoice(doc, e)} className="join-item btn btn-xs btn-ghost text-info font-bold" title="Convertir"><RefreshCcw className="w-4 h-4" /></button>
                                                    )}
                                                    <button onClick={(e) => deleteDocument(doc.docId, e)} className="join-item btn btn-xs btn-ghost text-error font-bold" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
}