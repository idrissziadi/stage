# 🚀 Guide de Démarrage Rapide - Gestion des Programmes

## 📋 Vue d'ensemble

Ce guide vous aide à tester rapidement les nouvelles fonctionnalités de gestion des programmes avec les différents rôles :

- **Établissement Régional** : Créer et gérer ses programmes
- **Établissement National** : Valider/refuser les programmes
- **Enseignant** : Consulter les programmes validés

## 🛠️ Installation et Configuration

### 1. Backend

```bash
cd backend

# Installer les dépendances (si pas déjà fait)
npm install

# Ajouter des données de test
node seed-programme-data.js

# Démarrer le serveur
npm start
```

### 2. Frontend

```bash
cd frontend

# Installer les dépendances (si pas déjà fait)
npm install

# Démarrer l'application
npm run dev
```

## 🧪 Tests des APIs

### Tester les endpoints programme

```bash
cd backend
node test-programme-api.js
```

### Endpoints disponibles

- `GET /programme` - Tous les programmes
- `GET /programme/stats` - Statistiques
- `GET /programme/status/:status` - Par statut
- `GET /programme/etablissement/:id` - Par établissement
- `GET /programme/enseignant/:id` - Par enseignant
- `POST /programme` - Créer un programme
- `PUT /programme/:id` - Modifier un programme
- `POST /programme/:id/validate` - Valider un programme
- `POST /programme/:id/reject` - Refuser un programme
- `DELETE /programme/:id` - Supprimer un programme

## 👥 Rôles et Fonctionnalités

### 🏛️ Établissement National

**Dashboard** : `http://localhost:5173/etablissement-nationale`

**Fonctionnalités** :
- ✅ Vue d'ensemble avec statistiques
- ✅ Supervision des programmes en attente
- ✅ Validation/refus avec observations
- ✅ Consultation de tous les programmes
- ✅ Filtres et recherche avancée

**Interface** :
- Onglet "Vue d'ensemble" : Statistiques et actions rapides
- Onglet "Supervision Programmes" : Interface complète de validation
- Onglet "Statistiques" : Analyses détaillées

### 🏢 Établissement Régional

**Dashboard** : `http://localhost:5173/etablissement-regionale`

**Fonctionnalités** :
- ✅ Création de nouveaux programmes
- ✅ Modification des programmes en attente
- ✅ Consultation de ses programmes
- ✅ Gestion des statuts

**Interface** :
- Onglet "البرامج" (Programmes) : Gestion complète des programmes

### 👨‍🏫 Enseignant

**Dashboard** : `http://localhost:5173/enseignant`

**Fonctionnalités** :
- ✅ Consultation des programmes validés
- ✅ Filtrage par module enseigné
- ✅ Détails complets des programmes

**Interface** :
- Onglet "البرامج" (Programmes) : Consultation des programmes validés

## 🎯 Workflow de Test

### 1. Créer un programme (Établissement Régional)

1. Connectez-vous en tant qu'établissement régional
2. Allez dans l'onglet "البرامج"
3. Cliquez sur "Nouveau Programme"
4. Remplissez les informations :
   - Code programme : `PROG-TEST-001`
   - Titre français : `Programme de Test`
   - Titre arabe : `برنامج اختبار`
   - Module : Sélectionnez un module
5. Cliquez sur "Créer"

### 2. Valider un programme (Établissement National)

1. Connectez-vous en tant qu'établissement national
2. Allez dans l'onglet "Supervision Programmes"
3. Dans l'onglet "En Attente", trouvez le programme créé
4. Cliquez sur "Examiner"
5. Ajoutez une observation : "Programme validé après révision"
6. Cliquez sur "Valider"

### 3. Consulter les programmes (Enseignant)

1. Connectez-vous en tant qu'enseignant
2. Allez dans l'onglet "البرامج"
3. Vérifiez que le programme validé apparaît
4. Testez les filtres par module
5. Cliquez sur "Voir détails" pour plus d'informations

## 🔧 Dépannage

### Page blanche

1. Vérifiez que le serveur backend fonctionne : `http://localhost:3000`
2. Vérifiez que le frontend fonctionne : `http://localhost:5173`
3. Ouvrez la console du navigateur pour voir les erreurs
4. Vérifiez que les routes sont bien enregistrées

### Erreurs API

1. Vérifiez que la base de données est connectée
2. Exécutez le script de test : `node test-programme-api.js`
3. Vérifiez les logs du serveur backend

### Données manquantes

1. Exécutez le script de données de test : `node seed-programme-data.js`
2. Vérifiez que des modules et établissements existent
3. Ajoutez des données manuellement si nécessaire

## 📊 Statuts des Programmes

- **في_الانتظار** (En attente) : Programme créé, en attente de validation
- **مقبول** (Validé) : Programme approuvé par l'établissement national
- **مرفوض** (Refusé) : Programme rejeté par l'établissement national

## 🎨 Interface Utilisateur

### Design System
- **Couleurs** : Bleu (total), Jaune (en attente), Vert (validé), Rouge (refusé)
- **Icônes** : Clock (attente), CheckCircle (validé), XCircle (refusé)
- **Composants** : Cards, Tabs, Dialogs, Badges, Progress bars

### Responsive Design
- **Desktop** : Interface complète avec sidebar et navigation
- **Tablet** : Adaptation des grilles et filtres
- **Mobile** : Interface optimisée pour les écrans tactiles

## 🚀 Prochaines Étapes

1. **Tests complets** : Tester tous les scénarios d'utilisation
2. **Optimisation** : Améliorer les performances et l'UX
3. **Fonctionnalités avancées** : Notifications, exports, rapports
4. **Sécurité** : Validation des données, permissions granulaires

---

**🎉 Félicitations !** Vous avez maintenant un système complet de gestion des programmes avec des interfaces extraordinaires pour chaque rôle.
