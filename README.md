# Fitness Tracker

Application web de suivi de fitness développée avec React et Vite. Organisez vos vidéos d'entraînement YouTube par catégories et suivez votre temps d'entraînement.

## Fonctionnalités

- **Gestion de catégories** : Créez et organisez vos propres catégories d'exercices
- **Drag & Drop** : Réorganisez vos catégories et vidéos par glisser-déposer
- **Ajout de vidéos YouTube** : Ajoutez facilement des vidéos depuis YouTube avec aperçu en temps réel
- **Édition** : Modifiez vos catégories et vidéos à tout moment
- **Lecteur vidéo intégré** : Regardez vos vidéos directement sur le site
- **Suivi du temps** : Le temps passé sur chaque vidéo est automatiquement enregistré
- **Firebase Firestore** : Synchronisation en temps réel de vos données dans le cloud
- **États de chargement** : Spinners de chargement pour une meilleure expérience utilisateur
- **Design responsive** : Interface optimisée pour mobile, tablette et desktop
- **Interface sobre** : Design minimaliste et moderne en mode sombre

## Installation

### Prérequis
- Node.js 18+ et npm
- Un projet Firebase (gratuit) - [Créer un projet](https://console.firebase.google.com/)

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd fitness-tracker
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer Firebase**
   - Copiez `.env.example` vers `.env`
   - Allez sur [Firebase Console](https://console.firebase.google.com/)
   - Créez un nouveau projet ou sélectionnez un projet existant
   - Dans Project Settings > General > Your apps, créez une application Web
   - Copiez les valeurs de configuration dans votre fichier `.env`
   - Voir [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) pour plus de détails

4. **Configurer Firestore**
   - Dans Firebase Console, allez dans Firestore Database
   - Créez une base de données en mode "production"
   - Allez dans l'onglet "Rules"
   - Copiez-collez le contenu de `firestore.rules`

5. **Lancer en développement**
```bash
npm run dev
```

6. **Build pour production**
```bash
npm run build
```

## Déploiement sur Vercel

Consultez le guide détaillé : [DEPLOYMENT.md](./DEPLOYMENT.md)

**Résumé rapide :**
1. Poussez votre code sur GitHub/GitLab/Bitbucket
2. Importez le projet sur [Vercel](https://vercel.com)
3. Configurez les variables d'environnement Firebase
4. Déployez automatiquement

## Utilisation

1. **Créer une catégorie** : Cliquez sur "Nouvelle catégorie" et donnez-lui un nom (ex: Biceps, Cardio, etc.)
2. **Ajouter une vidéo** : Cliquez sur "Ajouter une vidéo", collez l'URL YouTube, donnez un titre et sélectionnez une catégorie
3. **Regarder une vidéo** : Sélectionnez une catégorie dans la barre latérale, puis cliquez sur le bouton play d'une vidéo
4. **Suivre votre progression** : Le temps passé est automatiquement enregistré pour chaque vidéo et catégorie

## Technologies utilisées

- **React 19** - Framework UI
- **Vite 7** - Build tool ultra-rapide
- **Firebase Firestore** - Base de données NoSQL en temps réel
- **React Router 7** - Navigation SPA
- **@dnd-kit** - Bibliothèque drag & drop
- **react-youtube** - Lecteur YouTube intégré
- **lucide-react** - Icônes modernes
- **CSS Variables** - Système de thème personnalisable

## Structure du projet

```
fitness-tracker/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── Header.jsx       # En-tête avec boutons d'action
│   │   ├── Sidebar.jsx      # Barre latérale avec drag & drop
│   │   ├── VideoCard.jsx    # Carte de vidéo avec drag & drop
│   │   ├── Modal.jsx        # Modal générique
│   │   ├── LoadingSpinner.jsx # Composant de chargement
│   │   ├── YouTubePreview.jsx # Aperçu vidéo YouTube
│   │   ├── AddCategoryModal.jsx
│   │   ├── EditCategoryModal.jsx
│   │   ├── AddVideoModal.jsx
│   │   └── EditVideoModal.jsx
│   ├── pages/               # Pages de l'application
│   │   ├── Home.jsx         # Page d'accueil
│   │   ├── CategoryPage.jsx # Liste des vidéos (avec DnD)
│   │   └── VideoPlayer.jsx  # Lecteur vidéo
│   ├── context/             # État global
│   │   └── AppContext.jsx   # Context API + Firebase
│   ├── services/            # Services externes
│   │   └── firebaseService.js # CRUD Firebase Firestore
│   ├── config/              # Configuration
│   │   └── firebase.js      # Configuration Firebase
│   ├── utils/               # Fonctions utilitaires
│   │   ├── clearLocalStorage.js # Nettoyage localStorage
│   │   ├── youtube.js       # Extraction ID YouTube
│   │   └── time.js          # Formatage du temps
│   ├── styles/              # Fichiers CSS par composant
│   │   ├── variables.css    # Variables CSS + thème
│   │   ├── App.css          # Styles globaux + responsive
│   │   ├── LoadingSpinner.css
│   │   ├── YouTubePreview.css
│   │   └── ... (un CSS par composant)
│   ├── App.jsx              # Composant racine avec routing
│   ├── main.jsx             # Point d'entrée
│   └── index.css            # Reset CSS
├── .env                     # Variables d'environnement (ignoré par git)
├── .env.example             # Template des variables d'environnement
├── .gitignore               # Fichiers à ignorer par git
├── vercel.json              # Configuration Vercel
├── firestore.rules          # Règles de sécurité Firestore
├── DEPLOYMENT.md            # Guide de déploiement Vercel
├── FIREBASE_SETUP.md        # Guide de configuration Firebase
└── package.json
```

## Architecture

L'application suit une architecture modulaire avec :

- **Components** : Composants UI réutilisables et isolés avec drag & drop
- **Pages** : Pages complètes avec routing React Router 7
- **Context** : Gestion d'état global avec React Context API
- **Services** : Couche de services pour Firebase (CRUD, subscriptions temps réel)
- **Config** : Configuration Firebase et environnement
- **Utils** : Fonctions utilitaires pures (formatage, extraction, nettoyage)
- **Styles** : CSS modulaire par composant avec design responsive

### Flux de données

```
Firebase Firestore (Cloud)
    ↓ (Real-time subscriptions)
firebaseService.js
    ↓
AppContext.jsx (Global State)
    ↓
Components & Pages
    ↓ (User actions)
firebaseService.js
    ↓
Firebase Firestore (Cloud)
```

## Sécurité

⚠️ **Important** : Les règles Firestore actuelles permettent un accès complet pour faciliter le développement. Pour la production, vous devriez :

1. Implémenter Firebase Authentication
2. Mettre à jour les règles Firestore pour restreindre l'accès aux utilisateurs authentifiés
3. Ajouter une validation des données côté serveur

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour plus de détails sur la sécurisation.

## Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

MIT

## Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation [DEPLOYMENT.md](./DEPLOYMENT.md) et [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
