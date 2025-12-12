import React, { useState } from 'react';
import { Users, Trash2, Search, Plus, Mail, MapPin, Building, ArrowLeft } from 'lucide-react';
import { storage } from '../services/storage'; 

export default function ClientList({ clients, setClients, setView }) {
    const [searchTerm, setSearchTerm] = useState('');
    
    // Champs étendus pour correspondre à la BDD
    const [newClient, setNewClient] = useState({ 
        nom: '', 
        ncc: '', 
        email: '', 
        telephone: '', 
        adresse: '', 
        ville: '' 
    });
    
    const [isAdding, setIsAdding] = useState(false);

    const handleAddClient = async () => {
        if (!newClient.nom) return alert("Le nom est obligatoire");

        // Préparation pour SQLite (les colonnes existent bien dans database.cjs)
        const fullAddress = newClient.ville 
            ? `${newClient.adresse} (${newClient.ville})` 
            : newClient.adresse;

        const clientData = {
            uuid: crypto.randomUUID(), 
            nom: newClient.nom,
            ncc: newClient.ncc,          // <--- Connecté
            ville: newClient.ville,      // <--- Connecté
            email: newClient.email,
            telephone: newClient.telephone,
            adresse: fullAddress
        };

        try {
            if (window.electronAPI) {
                // 1. Sauvegarde via Electron
                await window.electronAPI.addClient(clientData);
                
                // 2. Recharger la liste depuis la DB
                const refreshedClients = await window.electronAPI.getClients();
                setClients(refreshedClients);
            } else {
                // Fallback Web
                const clientWeb = { ...clientData, id: Date.now() };
                const updated = [...clients, clientWeb];
                setClients(updated);
                await storage.save('clientDB', updated);
            }

            // Reset du formulaire
            setNewClient({ nom: '', ncc: '', email: '', telephone: '', adresse: '', ville: '' });
            setIsAdding(false);

        } catch (error) {
            console.error("Erreur sauvegarde client:", error);
            alert("Erreur lors de l'enregistrement dans la base de données.");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Supprimer ce client ?")) return;

        try {
            if (window.electronAPI) {
                // Suppression via Electron
                await window.electronAPI.deleteClient(id);
                // Recharger la liste pour maj affichage
                const refreshedClients = await window.electronAPI.getClients();
                setClients(refreshedClients);
            } else {
                // Fallback Web
                const updated = clients.filter(c => c.id !== id);
                setClients(updated);
                await storage.save('clientDB', updated);
            }
        } catch (error) {
            console.error("Erreur suppression:", error);
            alert("Impossible de supprimer le client.");
        }
    };

    const filteredClients = clients.filter(c => {
        const name = c.nom || c.name || '';
        const ncc = c.ncc || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase()) || ncc.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="h-full bg-base-200 p-8 overflow-y-auto font-sans text-base-content">
            <div className="max-w-5xl mx-auto pb-20">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
                        <Users className="w-8 h-8 text-primary" /> Mes Clients
                    </h2>
                    <button onClick={() => setView('editor')} className="btn btn-ghost btn-sm gap-2 text-base-content font-bold border-base-300 bg-base-100">
                        <ArrowLeft className="w-4 h-4" /> Retour
                    </button>
                </div>

                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 w-5 h-5 opacity-50 text-base-content" />
                        <input 
                            type="text" 
                            placeholder="Rechercher un client (Nom ou NCC)..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-bordered w-full pl-10 focus:input-primary text-base-content bg-base-100"
                        />
                    </div>
                    <button onClick={() => setIsAdding(!isAdding)} className="btn btn-primary text-white gap-2 shadow-md">
                        <Plus className="w-5 h-5" /> Nouveau Client
                    </button>
                </div>

                {isAdding && (
                    <div className="card bg-base-100 shadow-lg mb-6 border border-base-300 animate-fadeIn">
                        <div className="card-body p-6">
                            <h3 className="font-bold text-lg mb-4 text-base-content">Ajouter un nouveau client</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input type="text" placeholder="Nom / Raison Sociale *" value={newClient.nom} onChange={e => setNewClient({...newClient, nom: e.target.value})} className="input input-bordered w-full bg-base-100 text-base-content" />
                                <input type="text" placeholder="NCC" value={newClient.ncc} onChange={e => setNewClient({...newClient, ncc: e.target.value})} className="input input-bordered w-full bg-base-100 text-base-content" />
                                <input type="text" placeholder="Email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="input input-bordered w-full bg-base-100 text-base-content" />
                                <input type="text" placeholder="Téléphone" value={newClient.telephone} onChange={e => setNewClient({...newClient, telephone: e.target.value})} className="input input-bordered w-full bg-base-100 text-base-content" />
                                <input type="text" placeholder="Adresse" value={newClient.adresse} onChange={e => setNewClient({...newClient, adresse: e.target.value})} className="input input-bordered w-full bg-base-100 text-base-content" />
                                <input type="text" placeholder="Ville" value={newClient.ville} onChange={e => setNewClient({...newClient, ville: e.target.value})} className="input input-bordered w-full bg-base-100 text-base-content" />
                            </div>
                            <div className="card-actions justify-end">
                                <button onClick={() => setIsAdding(false)} className="btn btn-ghost text-base-content">Annuler</button>
                                <button onClick={handleAddClient} className="btn btn-primary text-white">Enregistrer</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="card bg-base-100 shadow-sm overflow-hidden border border-base-200">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full text-base-content">
                            <thead>
                                <tr className="text-base-content/70 uppercase text-xs font-bold bg-base-200/50">
                                    <th className="p-4 border-b border-base-200">Client</th>
                                    <th className="p-4 border-b border-base-200">Contact</th>
                                    <th className="p-4 border-b border-base-200">Adresse</th>
                                    <th className="p-4 border-b border-base-200 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClients.length === 0 ? (
                                    <tr><td colSpan="4" className="p-8 text-center text-base-content/50 italic">Aucun client trouvé.</td></tr>
                                ) : (
                                    filteredClients.map((client, index) => (
                                        <tr key={client.id || client.uuid || index} className="hover">
                                            <td className="p-4">
                                                <div className="font-bold text-base-content">{client.nom || client.name}</div>
                                                {client.ncc && <div className="badge badge-primary badge-outline badge-xs mt-1">NCC: {client.ncc}</div>}
                                            </td>
                                            <td className="p-4 text-sm text-base-content/80">
                                                {client.email && <div className="flex items-center gap-2"><Mail className="w-3 h-3 opacity-70" /> {client.email}</div>}
                                                {(client.telephone || client.phone) && <div className="flex items-center gap-2 mt-1"><Building className="w-3 h-3 opacity-70" /> {client.telephone || client.phone}</div>}
                                            </td>
                                            <td className="p-4 text-sm text-base-content/80">
                                                {client.ville && <div className="flex items-center gap-2"><MapPin className="w-3 h-3 opacity-70" /> {client.ville}</div>}
                                                <div className="text-xs opacity-60 ml-5">{client.adresse || client.address}</div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => handleDelete(client.id)} className="btn btn-ghost btn-xs text-error font-bold" title="Supprimer">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}