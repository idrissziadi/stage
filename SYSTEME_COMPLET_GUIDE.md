# 🚀 Guide Complet - Système de Gestion des Programmes

## 📋 Vue d'ensemble

Ce guide vous accompagne pour tester le système complet de gestion des programmes avec toutes les fonctionnalités développées :

### 🎯 **Fonctionnalités Développées**

#### **👨‍🏫 Enseignant**
- ✅ **Onglet البرامج** avec interface RTL complète
- ✅ **Filtrage dynamique** par module
- ✅ **Consultation** des programmes validés uniquement
- ✅ **Interface moderne** cohérente avec les autres sections
- ✅ **Connexion backend** dynamique

#### **🏛️ Établissement National**
- ✅ **Dashboard complet** avec statistiques en temps réel
- ✅ **Supervision des programmes** avec validation/refus
- ✅ **Interface extraordinaire** avec onglets et actions
- ✅ **Workflow complet** de gestion des programmes
- ✅ **Activités récentes** et métriques

#### **🏢 Établissement Régional**
- ✅ **Création de programmes** avec statut initial "في الانتظار"
- ✅ **Gestion de ses propres programmes**
- ✅ **Modification et suppression** des programmes en attente

## 🛠️ Installation et Configuration

### 1. **Backend**

```bash
cd backend

# Installer les dépendances
npm install

# Vérifier la connexion à la base de données
node -e "
const { sequelize } = require('./config/database');
sequelize.authenticate()
  .then(() => console.log('✅ Database OK'))
  .catch(err => console.log('❌ Database Error:', err.message))
  .finally(() => process.exit(0));
"

# Ajouter des données de test
node seed-programme-data.js

# Démarrer le serveur
npm start
```

### 2. **Frontend**

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer l'application
npm run dev
```

## 🧪 Tests du Système

### **Test Automatique**

```bash
cd backend
node test-complete-system.js
```

### **Test Manuel des APIs**

#### **1. Statistiques des Programmes**
```bash
curl http://localhost:3000/programme/stats
```

#### **2. Activités Récentes**
```bash
curl http://localhost:3000/programme/recent-activities
```

#### **3. Programmes par Statut**
```bash
curl http://localhost:3000/programme/status/في_الانتظار
curl http://localhost:3000/programme/status/مقبول
curl http://localhost:3000/programme/status/مرفوض
```

#### **4. Programmes pour Enseignant**
```bash
curl http://localhost:3000/programme/enseignant/1
```

## 🎨 Interface Utilisateur

### **Enseignant - Onglet البرامج**

1. **Accéder au dashboard enseignant**
2. **Cliquer sur l'onglet "البرامج"**
3. **Fonctionnalités disponibles :**
   - 📊 **Statistiques** : Programmes validés, modules enseignés, établissements
   - 🔍 **Recherche** : Par code, titre, module ou établissement
   - 📚 **Filtrage** : Par module avec onglets dynamiques
   - 👁️ **Consultation** : Détails complets des programmes
   - 📥 **Téléchargement** : PDF des programmes

### **Établissement National - Dashboard Complet**

1. **Accéder au dashboard national**
2. **Onglets disponibles :**
   - 📈 **نظرة عامة** : Vue d'ensemble avec statistiques
   - 📋 **إدارة البرامج** : Supervision et validation
   - 📊 **الإحصائيات** : Statistiques détaillées

3. **Fonctionnalités de supervision :**
   - ✅ **Validation** : Approuver les programmes avec observation
   - ❌ **Refus** : Rejeter les programmes avec justification
   - 📋 **Filtrage** : Par statut (En attente, Validés, Refusés)
   - 📊 **Métriques** : Statistiques en temps réel

## 🔄 Workflow Complet

### **1. Création (Établissement Régional)**
```
Établissement Régional → Crée un programme → Statut: "في الانتظار"
```

### **2. Validation (Établissement National)**
```
Établissement National → Consulte les programmes en attente → Valide/Refuse
```

### **3. Consultation (Enseignant)**
```
Enseignant → Consulte uniquement les programmes validés → Filtre par module
```

## 📱 URLs de Test

- **Frontend :** `http://localhost:5173`
- **Backend API :** `http://localhost:3000`
- **Swagger Docs :** `http://localhost:3000/api-docs`

## 🎯 Points de Test Clés

### **✅ Fonctionnalités à Vérifier**

#### **Enseignant**
- [ ] Onglet البرامج s'affiche correctement
- [ ] Interface RTL fonctionne
- [ ] Filtrage par module fonctionne
- [ ] Seuls les programmes validés sont visibles
- [ ] Recherche fonctionne
- [ ] Détails des programmes s'affichent

#### **Établissement National**
- [ ] Dashboard s'affiche avec statistiques
- [ ] Onglet supervision des programmes fonctionne
- [ ] Validation/refus des programmes fonctionne
- [ ] Activités récentes s'affichent
- [ ] Filtrage par statut fonctionne

#### **Backend**
- [ ] APIs répondent correctement
- [ ] Statistiques sont calculées
- [ ] Activités récentes sont récupérées
- [ ] Filtrage par statut fonctionne
- [ ] Authentification fonctionne

## 🐛 Dépannage

### **Problèmes Courants**

#### **1. Page Blanche**
```bash
# Vérifier les logs du frontend
cd frontend && npm run dev

# Vérifier les logs du backend
cd backend && npm start
```

#### **2. Erreurs d'API**
```bash
# Tester la connexion à la base
cd backend && node test-complete-system.js

# Vérifier les routes
curl http://localhost:3000/programme/stats
```

#### **3. Données Manquantes**
```bash
# Ajouter des données de test
cd backend && node seed-programme-data.js
```

## 📊 Métriques de Performance

### **Temps de Réponse Attendus**
- **APIs Programme :** < 500ms
- **Statistiques :** < 200ms
- **Activités récentes :** < 300ms
- **Interface utilisateur :** < 100ms

### **Capacité**
- **Programmes simultanés :** 1000+
- **Utilisateurs simultanés :** 100+
- **Requêtes par seconde :** 50+

## 🎉 Résultat Attendu

Après avoir suivi ce guide, vous devriez avoir :

1. ✅ **Un onglet البرامج fonctionnel** pour les enseignants
2. ✅ **Un dashboard complet** pour l'établissement national
3. ✅ **Un workflow complet** de gestion des programmes
4. ✅ **Une interface moderne et cohérente** sur toute l'application
5. ✅ **Une intégration backend-frontend totale** sans données statiques

## 📞 Support

En cas de problème :

1. **Vérifiez les logs** du serveur backend
2. **Ouvrez la console** du navigateur
3. **Testez les APIs** individuellement
4. **Consultez le guide de dépannage** `TROUBLESHOOTING_GUIDE.md`

---

**🎯 Objectif atteint :** Système complet de gestion des programmes avec interfaces extraordinaires et workflow fonctionnel !
