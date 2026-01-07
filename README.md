# 🇨🇮 Mon Facturier CI

![Electron](https://img.shields.io/badge/Electron-Latest-blue?logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Fast-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Local_DB-003B57?logo=sqlite&logoColor=white)

> **Mon Facturier CI** est une application Desktop moderne et performante conçue pour simplifier la gestion de la facturation pour les petites et moyennes entreprises en Côte d'Ivoire.

Bâtie avec **Electron** et **React**, l'application fonctionne entièrement **hors-ligne** grâce à une base de données locale, garantissant la sécurité et la disponibilité de vos données à tout moment.

---

##  Aperçu

![Capture d'écran de l'application](<img width="1585" height="768" alt="Capture d’écran 2026-01-07 151836" src="https://github.com/user-attachments/assets/e141b4dc-f23d-49d4-ad61-6d4ba6b2a4b2" />
)

---

##  Fonctionnalités Clés

* ** Gestion complète des documents** : Créez des **Factures**, **Devis** et **Reçus** professionnels en quelques clics.
* ** Gestion Clients** : Enregistrez, modifiez et retrouvez facilement vos clients.
* ** Catalogue Produits & Services** : Gérez une base de données de vos articles pour une saisie rapide.
* ** Export PDF Instantané** : Génération de documents PDF propres et conformes, prêts à être imprimés ou partagés.
* ** Tableau de Bord** : Vue d'ensemble de votre activité avec des indicateurs clairs.
* ** Mode Hors-ligne** : Toutes les données sont stockées localement (**SQLite**), aucune connexion internet requise.
* ** Personnalisation** :
    * Profil de l'entreprise complet (Logo, NCC, RCCM, Coordonnées).
    * Mode Sombre / Mode Clair (Thèmes Winter et Night).
* ** Sauvegarde Automatique** : Ne perdez jamais votre travail en cours grâce à l'auto-save des brouillons.

---

##  Technologies Utilisées

Ce projet repose sur une stack technique moderne et robuste :

| Catégorie | Technologie |
| :--- | :--- |
| **Wrapper Desktop** | [Electron](https://www.electronjs.org/) |
| **Frontend** | [React](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **UI/UX** | [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/) |
| **Icônes** | [Lucide React](https://lucide.dev/) |
| **Base de Données** | [Better SQLite3](https://github.com/WiseLibs/better-sqlite3) (Stockage local) |
| **PDF** | [@react-pdf/renderer](https://react-pdf.org/) |

---

##  Installation et Démarrage

Pour lancer le projet localement sur votre machine :

### 1. Cloner le dépôt

```bash
git clone [https://github.com/yobwweh/mon-facturier-ci.git](https://github.com/yobwweh/mon-facturier-ci.git)
cd mon-facturier-ci

2. Installer les dépendances
Bash

npm install
Note : Assurez-vous d'avoir les outils de compilation natifs installés (Python, C++ build tools) pour better-sqlite3 si nécessaire.

3. Lancer l'application
Mode Développement (Web uniquement) Pour travailler sur l'interface (la base de données locale sera simulée ou non disponible selon votre config).

Bash

npm run dev
Lancer l'application Desktop Pour lancer la version Electron complète avec base de données.

Bash

npm run start
4. Compiler pour la production
Pour créer l'exécutable (Windows/Mac/Linux).

Bash

npm run dist
👤 Auteur
Yoboué N'Guessan Armel Constant

Développé avec ❤️ pour les entrepreneurs de Côte d'Ivoire.
