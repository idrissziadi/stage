# 🏆 الجودة (Al-Jawda) - نظام إدارة التكوين المهني

## 🌟 **Vue d'ensemble**

**الجودة** (Al-Jawda) est une plateforme complète de gestion de la formation professionnelle développée pour le ministère marocain de la Formation Professionnelle, de l'Enseignement Supérieur et de la Recherche Scientifique.

## 🎯 **Mission**

Fournir une solution intégrée pour la gestion complète du système de formation professionnelle au Maroc, incluant :
- Administration des programmes éducatifs
- Gestion des stagiaires et enseignants
- Coordination entre établissements
- Suivi et reporting des performances

## 🏗️ **Architecture**

### **Frontend**
- **Framework :** React 18 + TypeScript
- **Styling :** Tailwind CSS + Shadcn/ui
- **Navigation :** React Router DOM
- **État :** React Query + React Hook Form
- **Direction :** RTL (Right-to-Left) pour l'arabe

### **Backend**
- **Runtime :** Node.js + Express
- **Base de données :** MySQL avec Sequelize ORM
- **Authentification :** JWT (JSON Web Tokens)
- **Documentation :** Swagger/OpenAPI 3.0
- **Validation :** Joi + Zod

### **Base de données**
- **SGBD :** MySQL 8.0+
- **ORM :** Sequelize avec migrations
- **Modèles :** Utilisateurs, Programmes, Cours, Modules, Établissements

## 🚀 **Installation et démarrage**

### **Prérequis**
- Node.js 18+ 
- MySQL 8.0+
- npm ou yarn

### **1. Cloner le repository**
```bash
git clone <repository-url>
cd stage
```

### **2. Configuration de la base de données**
```bash
# Créer la base de données
mysql -u root -p
CREATE DATABASE formation_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### **3. Configuration du backend**
```bash
cd backend
npm install
cp env.example .env
# Éditer .env avec vos paramètres de base de données
# Voir la section "Variables d'environnement" ci-dessous
```

### **4. Configuration du frontend**
```bash
cd frontend
npm install
cp env.example .env
# Éditer .env avec vos paramètres de configuration
# Voir la section "Variables d'environnement" ci-dessous
```

### **5. Démarrage des services**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🌐 **Accès à l'application**

- **Frontend :** http://localhost:5173
- **Backend API :** http://localhost:3000
- **Documentation API :** http://localhost:3000/api-docs

## 📱 **Fonctionnalités principales**

### **🔐 Authentification et autorisation**
- Connexion sécurisée avec JWT
- Gestion des rôles (Admin, Enseignant, Stagiaire, Établissement)
- Permissions granulaires

### **👥 Gestion des utilisateurs**
- Création et administration des comptes
- Profils personnalisés
- Gestion des permissions

### **📚 Gestion des programmes**
- Création de programmes de formation
- Gestion des modules et cours
- Suivi des statuts et approbations

### **🏫 Gestion des établissements**
- Administration des établissements nationaux
- Gestion des établissements régionaux
- Coordination inter-établissements

### **📊 Reporting et analytics**
- Tableaux de bord interactifs
- Rapports détaillés
- Indicateurs de performance

### **📁 Gestion des fichiers**
- Upload sécurisé de documents
- Visualiseur PDF intégré
- Gestion des versions

## 🔒 **Sécurité**

- **Authentification JWT** avec expiration configurable
- **Chiffrement des mots de passe** avec bcrypt
- **Validation des données** côté serveur et client
- **CORS configuré** pour la sécurité des requêtes
- **Rate limiting** pour prévenir les abus

## 🌍 **Internationalisation**

- **Arabe (principal)** : Interface complète en arabe
- **Français** : Support pour les termes techniques
- **Anglais** : Support pour l'internationalisation
- **Direction RTL** pour l'arabe

## 📋 **Structure du projet**

```
stage/
├── backend/                 # API Backend
│   ├── config/             # Configuration
│   ├── controllers/        # Contrôleurs
│   ├── models/            # Modèles Sequelize
│   ├── routes/            # Routes API
│   ├── middlewares/       # Middlewares
│   ├── upload/            # Fichiers uploadés
│   └── server.js          # Point d'entrée
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── pages/         # Pages de l'application
│   │   ├── hooks/         # Hooks personnalisés
│   │   ├── utils/         # Utilitaires
│   │   └── config/        # Configuration
│   ├── public/            # Fichiers statiques
│   └── index.html         # Page HTML principale
└── docs/                  # Documentation
```

## 🧪 **Tests**

### **Tests API**
```bash
cd backend
npm test
```

### **Tests Frontend**
```bash
cd frontend
npm test
```

## 📚 **Documentation**

- **Guide utilisateur :** `/docs/user-guide.md`
- **Guide développeur :** `/docs/developer-guide.md`
- **Configuration des variables d'environnement :** `ENV_CONFIGURATION.md`
- **API Swagger :** http://localhost:3000/api-docs
- **Configuration Swagger :** `README_SWAGGER.md`

## 🔧 **Configuration**

### **Variables d'environnement**

#### **Backend** (`backend/env.example`)
```bash
# Configuration du serveur
PORT=3000
HOST=localhost
NODE_ENV=development

# Configuration de la base de données
DB_HOST=localhost
DB_PORT=3306
DB_NAME=formation_db
DB_USER=root
DB_PASSWORD=

# Configuration JWT
JWT_SECRET=aljawda-secret-key-2024-change-in-production

# Configuration des emails (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Configuration CORS
CORS_ORIGIN=http://localhost:3000

# Configuration des logs
LOG_LEVEL=info

# Configuration de sécurité
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=15
SESSION_TIMEOUT=30
```

#### **Frontend** (`frontend/env.example`)
```bash
# Configuration de l'API Backend
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=10000

# Configuration de l'application
VITE_APP_NAME=الجودة
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# Configuration des fonctionnalités
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
VITE_ENABLE_PWA=true

# Configuration des services externes (optionnel)
VITE_GOOGLE_ANALYTICS_ID=
VITE_SENTRY_DSN=

# Configuration de l'interface
VITE_DEFAULT_LOCALE=ar
VITE_DEFAULT_THEME=light
VITE_ENABLE_RTL=true

# Configuration de sécurité
VITE_JWT_STORAGE_KEY=aljawda_token
VITE_REFRESH_TOKEN_KEY=aljawda_refresh_token
VITE_SESSION_TIMEOUT=3600000

# Configuration des uploads
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=pdf,doc,docx,ppt,pptx,xls,xlsx,jpg,jpeg,png
VITE_UPLOAD_CHUNK_SIZE=1024000
```

### **Configuration de l'application**
- **Backend :** `backend/config/app.js`
- **Frontend :** `frontend/src/config/app.ts`

## 🚀 **Déploiement**

### **Environnements**
- **Développement :** http://localhost:3000
- **Staging :** https://staging.aljawda.formation.gov.ma
- **Production :** https://aljawda.formation.gov.ma

### **Docker (optionnel)**
```bash
docker-compose up -d
```

## 🤝 **Contribution**

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 **Licence**

Ce projet est développé pour le ministère marocain de la Formation Professionnelle. Tous droits réservés.

## 📞 **Support**

- **Équipe de développement :** Direction des Systèmes d'Information
- **Ministère :** وزارة التكوين المهني والتعليم العالي والبحث العلمي
- **Email :** support@formation.gov.ma

## 🎉 **Remerciements**

- Ministère de la Formation Professionnelle
- Équipe de développement
- Contributeurs et testeurs

---

**"الجودة ليست خياراً، بل هي التزام"**  
*"La qualité n'est pas un choix, c'est un engagement"*
