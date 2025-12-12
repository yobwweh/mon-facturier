import React, { useState, useEffect } from 'react';
import { Package, Trash2, Search, Plus, ArrowLeft } from 'lucide-react';
import { storage } from '../services/storage'; 

export default function ProductList({ products, setProducts, setView, formatMoney }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [newProduct, setNewProduct] = useState({ description: '', price: '' });
    const [isAdding, setIsAdding] = useState(false);

    // Fonction utilitaire pour recharger les données selon l'environnement
    const reloadProducts = async () => {
        if (window.electronAPI) {
            const data = await window.electronAPI.getProducts();
            setProducts(data);
        }
    };

    const handleAddProduct = async () => {
        if (!newProduct.description || !newProduct.price) return alert("Champs obligatoires");
        
        // Préparation de l'objet (price doit être un nombre)
        const productData = { 
            description: newProduct.description, 
            price: parseFloat(newProduct.price) 
        };

        try {
            if (window.electronAPI) {
                // --- VERSION ELECTRON (SQLite) ---
                await window.electronAPI.addProduct(productData);
                await reloadProducts(); // Recharger la liste depuis la BDD
            } else {
                // --- VERSION WEB (Fallback) ---
                const updatedProducts = [...products, { ...productData, id: Date.now() }];
                setProducts(updatedProducts);
                await storage.save('productDB', updatedProducts);
            }
            
            // Reset du formulaire
            setNewProduct({ description: '', price: '' });
            setIsAdding(false);

        } catch (error) {
            console.error("Erreur ajout produit:", error);
            alert("Impossible d'ajouter le produit.");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Supprimer ce produit ?")) return;

        try {
            if (window.electronAPI) {
                // --- VERSION ELECTRON (SQLite) ---
                await window.electronAPI.deleteProduct(id);
                await reloadProducts();
            } else {
                // --- VERSION WEB (Fallback) ---
                const updated = products.filter(p => p.id !== id);
                setProducts(updated);
                await storage.save('productDB', updated);
            }
        } catch (error) {
            console.error("Erreur suppression produit:", error);
            alert("Impossible de supprimer le produit.");
        }
    };

    const filtered = products.filter(p => p.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="h-full bg-base-200 p-8 overflow-y-auto font-sans text-base-content">
            <div className="max-w-4xl mx-auto pb-20">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-base-content">
                        <Package className="w-8 h-8 text-primary" /> Catalogue
                    </h2>
                    <button onClick={() => setView('editor')} className="btn btn-ghost btn-sm gap-2 text-base-content font-bold border-base-300 bg-base-100">
                        <ArrowLeft className="w-4 h-4" /> Retour
                    </button>
                </div>

                <div className="flex gap-4 mb-6">
                    <div className="join w-full shadow-sm">
                        <div className="join-item flex items-center bg-base-100 px-3 border border-base-300"><Search className="w-5 h-5 opacity-50 text-base-content" /></div>
                        <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="join-item input input-bordered w-full bg-base-100 text-base-content focus:input-primary" />
                    </div>
                    <button onClick={() => setIsAdding(!isAdding)} className="btn btn-primary text-white shadow-md">
                        <Plus className="w-5 h-5" /> Ajouter
                    </button>
                </div>

                {isAdding && (
                    <div className="card bg-base-100 shadow-lg mb-6 border-l-4 border-primary">
                        <div className="card-body p-4">
                            <h3 className="font-bold text-lg mb-2 text-base-content">Nouvel article</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Nom du produit" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="input input-bordered w-full bg-base-100 text-base-content" />
                                <input type="number" placeholder="Prix" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="input input-bordered w-full bg-base-100 text-base-content" />
                            </div>
                            <div className="card-actions justify-end mt-4">
                                <button onClick={() => setIsAdding(false)} className="btn btn-ghost btn-sm text-base-content">Annuler</button>
                                <button onClick={handleAddProduct} className="btn btn-primary btn-sm text-white">Enregistrer</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="card bg-base-100 shadow-sm overflow-hidden border border-base-200">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full text-base-content">
                            <thead>
                                <tr className="bg-base-200/50 text-base-content/70"><th>Désignation</th><th className="text-right">Prix</th><th className="text-center">Action</th></tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan="3" className="text-center p-8 opacity-50 text-base-content">Aucun produit.</td></tr>
                                ) : (
                                    filtered.map(p => (
                                        <tr key={p.id}>
                                            <td className="font-bold">{p.description}</td>
                                            <td className="text-right font-mono">{formatMoney(p.price)}</td>
                                            <td className="text-center">
                                                <button onClick={() => handleDelete(p.id)} className="btn btn-ghost btn-xs text-error font-bold"><Trash2 className="w-4 h-4" /></button>
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