import React, { useState, useEffect } from 'react';
import { Save, Upload, X, Settings, ArrowLeft } from 'lucide-react';
import { storage } from '../services/storage'; 

export default function SettingsView({ setView, showNotification, onProfileUpdate }) {
    const [profile, setProfile] = useState({
        name: '', legalForm: '', capital: '', address: '', city: '', zip: '', 
        email: '', phone: '', ncc: '', rccm: '', bankName: '', iban: '', logo: null
    });

    useEffect(() => {
        const load = async () => {
            const saved = await storage.get('companyProfile');
            if (saved) setProfile(saved);
        };
        load();
    }, []);

    const handleSave = async () => {
        await storage.save('companyProfile', profile);
        if (onProfileUpdate) onProfileUpdate(profile);
        if (showNotification) showNotification("Profil sauvegardé !");
    };

    const handleLogo = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfile(p => ({ ...p, logo: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="h-full bg-base-200 p-8 overflow-y-auto font-sans text-base-content">
            <div className="max-w-4xl mx-auto pb-20">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-base-content">
                        <Settings className="w-8 h-8 text-primary" /> Paramètres Entreprise
                    </h2>
                    {/* BOUTON RETOUR CORRIGÉ : Visible en jour et nuit */}
                    <button onClick={() => setView('editor')} className="btn btn-ghost btn-sm gap-2 text-base-content font-bold border-base-300">
                        <ArrowLeft className="w-4 h-4" /> Retour
                    </button>
                </div>

                <div className="card bg-base-100 shadow-xl overflow-visible border border-base-200">
                    <div className="card-body p-0">
                        <div className="p-6 border-b border-base-200 flex justify-between items-center sticky top-0 bg-base-100 z-10 rounded-t-2xl">
                            <div>
                                <h3 className="font-bold text-lg text-base-content">Informations Générales</h3>
                                <p className="text-xs opacity-60 text-base-content">Ces informations apparaîtront sur vos documents.</p>
                            </div>
                            <button onClick={handleSave} className="btn btn-primary text-white gap-2 shadow-lg shadow-primary/30">
                                <Save className="w-4 h-4" /> Enregistrer
                            </button>
                        </div>
                        
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-bold uppercase text-xs text-base-content">Logo</span></label>
                                    <div className="relative w-40 h-40 bg-base-100 border-2 border-dashed border-base-300 rounded-2xl flex items-center justify-center overflow-hidden group hover:border-primary hover:bg-base-200 transition-all mx-auto md:mx-0">
                                        {profile.logo ? (
                                            <>
                                                <img src={profile.logo} className="w-full h-full object-contain" alt="Logo" />
                                                <button onClick={() => setProfile(p => ({...p, logo: null}))} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="w-8 h-8" />
                                                </button>
                                            </>
                                        ) : ( 
                                            <div className="text-center p-4">
                                                <Upload className="w-8 h-8 text-base-content/30 mx-auto mb-2" />
                                                <span className="text-xs opacity-50 text-base-content">Image</span>
                                                <input type="file" accept="image/*" onChange={handleLogo} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-bold text-base-content">Raison Sociale</span></label>
                                    <input type="text" value={profile.name} onChange={(e) => setProfile(p => ({...p, name: e.target.value}))} className="input input-bordered w-full bg-base-100 text-base-content focus:input-primary" placeholder="Votre entreprise" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="form-control">
                                        <label className="label"><span className="label-text font-bold text-base-content">Forme</span></label>
                                        <input type="text" value={profile.legalForm} onChange={(e) => setProfile(p => ({...p, legalForm: e.target.value}))} className="input input-bordered w-full bg-base-100 text-base-content" placeholder="SARL" />
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text font-bold text-base-content">Capital</span></label>
                                        <input type="text" value={profile.capital} onChange={(e) => setProfile(p => ({...p, capital: e.target.value}))} className="input input-bordered w-full bg-base-100 text-base-content" placeholder="1 000 000" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-bold text-base-content">Localisation</span></label>
                                    <input type="text" value={profile.address} onChange={(e) => setProfile(p => ({...p, address: e.target.value}))} className="input input-bordered w-full mb-2 bg-base-100 text-base-content" placeholder="Adresse" />
                                    <input type="text" value={profile.city} onChange={(e) => setProfile(p => ({...p, city: e.target.value}))} className="input input-bordered w-full bg-base-100 text-base-content" placeholder="Ville / Commune" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="form-control">
                                        <label className="label"><span className="label-text font-bold text-base-content">Téléphone</span></label>
                                        <input type="text" value={profile.phone} onChange={(e) => setProfile(p => ({...p, phone: e.target.value}))} className="input input-bordered w-full bg-base-100 text-base-content" placeholder="+225..." />
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text font-bold text-base-content">Email</span></label>
                                        <input type="email" value={profile.email} onChange={(e) => setProfile(p => ({...p, email: e.target.value}))} className="input input-bordered w-full bg-base-100 text-base-content" placeholder="@..." />
                                    </div>
                                </div>

                                {/* CORRECTION : Remplacement de l'alerte jaune illisible par un fond neutre */}
                                <div className="bg-base-200/50 p-4 rounded-lg border border-base-200">
                                    <div className="w-full">
                                        <h4 className="text-xs font-bold text-base-content/70 uppercase mb-3">Fiscalité (DGI)</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" value={profile.ncc} onChange={(e) => setProfile(p => ({...p, ncc: e.target.value}))} className="input input-bordered input-sm w-full bg-base-100 text-base-content" placeholder="NCC" />
                                            <input type="text" value={profile.rccm} onChange={(e) => setProfile(p => ({...p, rccm: e.target.value}))} className="input input-bordered input-sm w-full bg-base-100 text-base-content" placeholder="RCCM" />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label"><span className="label-text font-bold text-base-content">Banque</span></label>
                                    <div className="space-y-2">
                                        <input type="text" value={profile.bankName} onChange={(e) => setProfile(p => ({...p, bankName: e.target.value}))} className="input input-bordered w-full bg-base-100 text-base-content" placeholder="Nom banque" />
                                        <input type="text" value={profile.iban} onChange={(e) => setProfile(p => ({...p, iban: e.target.value}))} className="input input-bordered w-full font-mono bg-base-100 text-base-content" placeholder="IBAN" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}