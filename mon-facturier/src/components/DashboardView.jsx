import React from 'react';
import { FileText, Plus, ArrowLeft, TrendingUp, AlertCircle, Wallet, Users } from 'lucide-react';

export default function DashboardView({ savedDocuments = [], clients = [], formatMoney = (val) => val + ' FCFA', setView }) {
    
    const validDocs = savedDocuments ? savedDocuments.filter(d => d && typeof d === 'object') : [];

    const getDocAmount = (doc) => {
        if (!doc) return 0;
        if (doc.type === 'RECU') return parseFloat(doc.receiptAmount) || 0;
        if (!doc.items || !Array.isArray(doc.items)) return 0;
        try {
            const subtotal = doc.items.reduce((acc, item) => acc + ((parseFloat(item.quantity)||0) * (parseFloat(item.price)||0)), 0);
            return doc.hasTax ? subtotal * (1 + (parseFloat(doc.taxRate)||0) / 100) : subtotal;
        } catch (e) { return 0; }
    };

    const totalCash = validDocs.reduce((acc, doc) => {
        if (doc.type === 'RECU') return acc + (parseFloat(doc.receiptAmount) || 0);
        if (doc.type === 'FACTURE') return acc + (doc.status === 'PAID' ? getDocAmount(doc) : (parseFloat(doc.advance) || 0));
        return acc;
    }, 0);

    const totalPending = validDocs
        .filter(d => d.type === 'FACTURE' && d.status === 'PENDING')
        .reduce((acc, doc) => acc + Math.max(0, getDocAmount(doc) - (parseFloat(doc.advance) || 0)), 0);

    const totalRevenue = validDocs.filter(d => d.type === 'FACTURE').reduce((acc, d) => acc + getDocAmount(d), 0);
    const recentDocs = [...validDocs].reverse().slice(0, 5);

    return (
        <div className="h-full bg-base-200 p-8 overflow-y-auto font-sans text-base-content">
            <div className="max-w-6xl mx-auto space-y-8 pb-20">
                
                {/* EN-TÊTE */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-base-content flex items-center gap-2">
                           Tableau de Bord
                        </h2>
                        <p className="text-base-content/60 text-sm">
                            Vue d'ensemble • {validDocs.length} document(s)
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setView('editor')} className="btn btn-ghost btn-sm text-base-content font-bold border-base-300 bg-base-100">
                            <ArrowLeft className="w-4 h-4" /> Retour
                        </button>
                        <button onClick={() => setView('editor')} className="btn btn-primary btn-sm text-white shadow-md">
                            Nouveau <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* KPI STATS - CORRECTION ICONES PALES */}
                <div className="stats shadow-sm w-full bg-base-100 text-base-content grid-cols-1 md:grid-cols-3 border border-base-200">
                    
                    <div className="stat">
                        {/* CORRECTION ICI : text-emerald-500 sans opacité */}
                        <div className="stat-figure text-emerald-500">
                            <Wallet className="w-12 h-12" />
                        </div>
                        <div className="stat-title font-bold uppercase tracking-wider text-base-content/60 text-xs">Trésorerie (Cash)</div>
                        <div className="stat-value text-emerald-700 text-2xl lg:text-3xl">{formatMoney(totalCash)}</div>
                        <div className="stat-desc text-emerald-700 font-bold flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3" /> Encaissé réellement
                        </div>
                    </div>
                    
                    <div className="stat">
                        {/* CORRECTION ICI : text-amber-500 sans opacité */}
                        <div className="stat-figure text-amber-500">
                            <AlertCircle className="w-12 h-12" />
                        </div>
                        <div className="stat-title font-bold uppercase tracking-wider text-base-content/60 text-xs">Reste à percevoir</div>
                        <div className="stat-value text-amber-600 text-2xl lg:text-3xl">{formatMoney(totalPending)}</div>
                        <div className="stat-desc text-amber-600 font-bold mt-1">Créances clients</div>
                    </div>
                    
                    <div className="stat">
                        {/* CORRECTION ICI : text-blue-500 sans opacité */}
                        <div className="stat-figure text-blue-500">
                            <FileText className="w-12 h-12" />
                        </div>
                        <div className="stat-title font-bold uppercase tracking-wider text-base-content/60 text-xs">Chiffre d'Affaires</div>
                        <div className="stat-value text-blue-700 text-2xl lg:text-3xl">{formatMoney(totalRevenue)}</div>
                        <div className="stat-desc text-blue-700 font-bold mt-1">Volume facturé total</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ACTIVITÉ RÉCENTE */}
                    <div className="card bg-base-100 shadow-sm border border-base-200 lg:col-span-2">
                        <div className="card-body p-0">
                            <div className="p-4 border-b border-base-200 flex justify-between items-center bg-base-100">
                                <h4 className="font-bold text-xs uppercase opacity-70 text-base-content">Activité Récente</h4>
                                <button onClick={() => setView('history')} className="link link-primary text-xs font-bold no-underline">Tout voir</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                    <tbody>
                                        {recentDocs.length === 0 ? (
                                            <tr><td className="text-center p-8 opacity-50 text-base-content">Aucun document.</td></tr>
                                        ) : (
                                            recentDocs.map((doc, idx) => {
                                                const amount = getDocAmount(doc);
                                                let display = formatMoney(amount);
                                                if(doc.type === 'RECU') display = "+" + display;
                                                const isPaid = doc.status === 'PAID' || doc.type === 'RECU';

                                                return (
                                                    <tr key={idx} className="hover">
                                                        <td>
                                                            <div className="flex items-center gap-3">
                                                                <div className={`badge badge-sm font-bold border-none text-white ${doc.type === 'RECU' ? 'bg-emerald-600' : doc.type === 'DEVIS' ? 'bg-gray-500' : 'bg-blue-600'}`}>
                                                                    {doc.type === 'RECU' ? 'RC' : doc.type === 'DEVIS' ? 'DV' : 'FA'}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-sm text-base-content">{doc.recipient?.name}</div>
                                                                    <div className="text-[10px] opacity-60 text-base-content">{doc.number} • {new Date(doc.date).toLocaleDateString()}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-right font-mono font-bold text-base-content">
                                                            {display}
                                                        </td>
                                                        <td className="text-right">
                                                            <span className={`badge badge-xs font-bold py-2 border-none ${isPaid ? 'bg-green-600 text-white' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                {isPaid ? 'PAYÉ' : 'ATTENTE'}
                                                            </span>
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

                    {/* LISTE CLIENTS RAPIDE */}
                    <div className="card bg-base-100 shadow-sm border border-base-200 h-fit">
                        <div className="card-body p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-xs uppercase opacity-70 flex items-center gap-2 text-base-content">
                                    <Users className="w-4 h-4" /> Clients
                                </h4>
                                <span className="badge badge-neutral badge-sm text-white">{clients.length}</span>
                            </div>
                            <ul className="menu bg-base-200 rounded-box text-base-content mb-4">
                                {clients.slice(0, 5).map((client, idx) => (
                                    <li key={idx}><a className="flex justify-between text-xs font-bold">
                                        <span className="truncate max-w-[120px]">{client.name}</span>
                                        <span className="opacity-50 font-normal">{client.phone}</span>
                                    </a></li>
                                ))}
                                {clients.length === 0 && <li className="disabled text-base-content/50"><a>Aucun client</a></li>}
                            </ul>
                            <button onClick={() => setView('clients')} className="btn btn-outline btn-primary btn-sm w-full">
                                Gérer les clients
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}