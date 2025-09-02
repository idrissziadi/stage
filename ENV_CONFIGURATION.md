# 🔧 Guide de Configuration des Variables d'Environnement - الجودة

## 📋 Vue d'ensemble

Ce guide explique comment configurer les variables d'environnement pour l'application **الجودة** (Al-Jawda), tant pour le backend que pour le frontend.

## 🚀 Configuration Rapide

### **1. Backend**
```bash
cd backend
cp env.example .env
# Éditer .env avec vos vraies valeurs
```

### **2. Frontend**
```bash
cd frontend
cp env.example .env
# Éditer .env avec vos vraies valeurs
```

## 🔐 Variables d'Environnement Backend

### **Configuration du Serveur**
| Variable | Description | Valeur par défaut | Obligatoire |
|----------|-------------|-------------------|-------------|
| `PORT` | Port du serveur | `3000` | ✅ |
| `HOST` | Adresse du serveur | `localhost` | ✅ |
| `NODE_ENV` | Environnement | `development` | ✅ |

### **Configuration de la Base de Données**
| Variable | Description | Valeur par défaut | Obligatoire |
|----------|-------------|-------------------|-------------|
| `DB_HOST` | Hôte MySQL | `localhost` | ✅ |
| `DB_PORT` | Port MySQL | `3306` | ✅ |
| `DB_NAME` | Nom de la base | `formation_db` | ✅ |
| `DB_USER` | Utilisateur MySQL | `root` | ✅ |
| `DB_PASSWORD` | Mot de passe MySQL | - | ✅ |

### **Configuration JWT**
| Variable | Description | Valeur par défaut | Obligatoire |
|----------|-------------|-------------------|-------------|
| `JWT_SECRET` | Clé secrète JWT | `aljawda-secret-key-2024` | ✅ |

### **Configuration Email (Optionnel)**
| Variable | Description | Valeur par défaut | Obligatoire |
|----------|-------------|-------------------|-------------|
| `EMAIL_HOST` | Serveur SMTP | `smtp.gmail.com` | ❌ |
| `EMAIL_PORT` | Port SMTP | `587` | ❌ |
| `EMAIL_USER` | Email d'envoi | - | ❌ |
| `EMAIL_PASSWORD` | Mot de passe email | - | ❌ |

### **Configuration CORS**
| Variable | Description | Valeur par défaut | Obligatoire |
|----------|-------------|-------------------|-------------|
| `CORS_ORIGIN` | Origine autorisée | `http://localhost:3000` | ✅ |

### **Configuration de Sécurité**
| Variable | Description | Valeur par défaut | Obligatoire |
|----------|-------------|-------------------|-------------|
| `BCRYPT_ROUNDS` | Tours de hachage | `12` | ✅ |
| `MAX_LOGIN_ATTEMPTS` | Tentatives max | `5` | ✅ |
| `LOCKOUT_DURATION` | Durée de blocage (min) | `15` | ✅ |
| `SESSION_TIMEOUT` | Timeout session (min) | `30` | ✅ |

## 🎨 Variables d'Environnement Frontend

### **Configuration de l'API**
| Variable | Description | Valeur par défaut | Obligatoire |
|----------|-------------|-------------------|-------------|
| `VITE_API_BASE_URL` | URL de l'API | `http://localhost:3000` | ✅ |
| `VITE_API_TIMEOUT` | Timeout API (ms) | `10000` | ✅ |

### **Configuration de l'Application**
| Variable | Description | Valeur par défaut | Obligatoire |
|----------|-------------|-------------------|-------------|
| `VITE_APP_NAME` | Nom de l'app | `الجودة` | ✅ |
| `VITE_APP_VERSION` | Version | `1.0.0` | ✅ |
| `VITE_APP_ENV` | Environnement | `development` | ✅ |

### **Configuration des Fonctionnalités**
| Variable | Description | Valeur par défaut | Obligatoire |
|----------|-------------|-------------------|-------------|
| `VITE_ENABLE_ANALYTICS` | Activer analytics | `false` | ❌ |
| `VITE_ENABLE_DEBUG` | Mode debug | `true` | ❌ |
| `VITE_ENABLE_PWA` | Activer PWA | `true` | ❌ |

### **Configuration de l'Interface**
| Variable | Description | Valeur par défaut | Obligatoire |
|----------|-------------|-------------------|-------------|
| `VITE_DEFAULT_LOCALE` | Langue par défaut | `ar` | ✅ |
| `VITE_DEFAULT_THEME` | Thème par défaut | `light` | ✅ |
| `VITE_ENABLE_RTL` | Activer RTL | `true` | ✅ |

### **Configuration de Sécurité**
| Variable | Description | Valeur par défaut | Obligatoire |
|----------|-------------|-------------------|-------------|
| `VITE_JWT_STORAGE_KEY` | Clé stockage JWT | `aljawda_token` | ✅ |
| `VITE_REFRESH_TOKEN_KEY` | Clé refresh token | `aljawda_refresh_token` | ✅ |
| `VITE_SESSION_TIMEOUT` | Timeout session (ms) | `3600000` | ✅ |

### **Configuration des Uploads**
| Variable | Description | Valeur par défaut | Obligatoire |
|----------|-------------|-------------------|-------------|
| `VITE_MAX_FILE_SIZE` | Taille max fichier (bytes) | `10485760` (10MB) | ✅ |
| `VITE_ALLOWED_FILE_TYPES` | Types autorisés | `pdf,doc,docx,ppt,pptx,xls,xlsx,jpg,jpeg,png` | ✅ |
| `VITE_UPLOAD_CHUNK_SIZE` | Taille chunk upload (bytes) | `1024000` (1MB) | ✅ |

## 🛠️ Exemples de Configuration

### **Backend - Développement**
```bash
# .env
PORT=3000
HOST=localhost
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=formation_db_dev
DB_USER=root
DB_PASSWORD=mon_mot_de_passe
JWT_SECRET=ma_cle_secrete_dev_2024
CORS_ORIGIN=http://localhost:5173
```

### **Backend - Production**
```bash
# .env
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
DB_HOST=production-db-host
DB_PORT=3306
DB_NAME=formation_db_prod
DB_USER=formation_user
DB_PASSWORD=MotDePasseSecurise2024!
JWT_SECRET=CleSecreteProductionTresLongueEtComplexe2024
CORS_ORIGIN=https://aljawda.formation.gov.ma
```

### **Frontend - Développement**
```bash
# .env
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=10000
VITE_APP_NAME=الجودة
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
VITE_ENABLE_DEBUG=true
VITE_DEFAULT_LOCALE=ar
VITE_ENABLE_RTL=true
```

### **Frontend - Production**
```bash
# .env
VITE_API_BASE_URL=https://api.aljawda.formation.gov.ma
VITE_API_TIMEOUT=15000
VITE_APP_NAME=الجودة
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ANALYTICS=true
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_DEFAULT_LOCALE=ar
VITE_ENABLE_RTL=true
```

## 🔒 Sécurité

### **Variables Sensibles**
- **Ne jamais commiter** les fichiers `.env` dans Git
- **Toujours utiliser** des mots de passe forts en production
- **Changer** `JWT_SECRET` en production
- **Limiter** l'accès aux variables de production

### **Bonnes Pratiques**
1. **Copier** `env.example` vers `.env`
2. **Remplir** avec vos vraies valeurs
3. **Vérifier** que `.env` est dans `.gitignore`
4. **Tester** la configuration avant déploiement
5. **Documenter** les changements de configuration

## 🚨 Dépannage

### **Erreurs Courantes**

#### **Backend ne démarre pas**
```bash
# Vérifier que .env existe
ls -la backend/.env

# Vérifier les variables obligatoires
echo $DB_HOST
echo $DB_PASSWORD
```

#### **Frontend ne se connecte pas à l'API**
```bash
# Vérifier VITE_API_BASE_URL
echo $VITE_API_BASE_URL

# Tester la connexion API
curl http://localhost:3000/
```

#### **Base de données inaccessible**
```bash
# Vérifier la connexion MySQL
mysql -u $DB_USER -p -h $DB_HOST -P $DB_PORT

# Vérifier que la base existe
SHOW DATABASES;
```

## 📚 Ressources

- **Documentation Vite** : https://vitejs.dev/guide/env-and-mode.html
- **Documentation dotenv** : https://www.npmjs.com/package/dotenv
- **Guide de sécurité** : `SECURITY_GUIDE.md`
- **Configuration Swagger** : `README_SWAGGER.md`

---

**"التكوين الجيد يبدأ بالتهيئة الصحيحة"**  
*"Une bonne formation commence par une bonne configuration"*
