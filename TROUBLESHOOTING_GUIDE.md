# 🔧 Guide de Dépannage - Gestion des Programmes

## 🚨 Problèmes Courants et Solutions

### 1. Erreur d'import API

**Erreur :** `The requested module '/src/services/api.ts' does not provide an export named 'api'`

**Solution :**
```typescript
// ❌ Incorrect
import { api } from '@/services/api';

// ✅ Correct
import { apiService as api } from '@/services/api';
```

**Fichiers à corriger :**
- `frontend/src/components/enseignant/ProgrammeConsultation.tsx`
- `frontend/src/components/etablissement-nationale/ProgrammeSupervision.tsx`
- `frontend/src/components/etablissement-regionale/ProgrammeManagement.tsx`

### 2. Erreur d'import Button

**Erreur :** `The requested module '/src/components/ui/badge.tsx' does not provide an export named 'Button'`

**Solution :**
```typescript
// ❌ Incorrect
import { Button } from '@/components/ui/badge';

// ✅ Correct
import { Button } from '@/components/ui/button';
```

### 3. Page Blanche

**Causes possibles :**
1. Serveur backend non démarré
2. Erreurs de compilation TypeScript
3. Erreurs d'import manquantes

**Solutions :**

#### A. Vérifier le backend
```bash
cd backend
npm start
```

#### B. Vérifier les logs du frontend
```bash
cd frontend
npm run dev
```

#### C. Vérifier la console du navigateur
- Ouvrir les outils de développement (F12)
- Aller dans l'onglet "Console"
- Chercher les erreurs en rouge

### 4. Erreurs de Base de Données

**Problème :** Pas de données affichées

**Solutions :**

#### A. Ajouter des données de test
```bash
cd backend
node seed-programme-data.js
```

#### B. Vérifier la connexion à la base
```bash
cd backend
node test-programme-api.js
```

#### C. Vérifier que les tables existent
```sql
-- Dans MySQL
SHOW TABLES;
SELECT * FROM programmes LIMIT 5;
```

### 5. Erreurs d'Authentification

**Problème :** Erreurs 401/403

**Solutions :**

#### A. Vérifier le token JWT
```javascript
// Dans la console du navigateur
localStorage.getItem('token')
```

#### B. Se reconnecter
- Aller sur la page de connexion
- Se reconnecter avec des identifiants valides

### 6. Erreurs de CORS

**Problème :** Erreurs CORS dans la console

**Solution :**
Vérifier que le backend autorise les requêtes depuis le frontend :

```javascript
// Dans backend/server.js
app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 🛠️ Scripts de Diagnostic

### 1. Test de Connexion Base de Données
```bash
cd backend
node -e "
const { sequelize } = require('./config/database');
sequelize.authenticate()
  .then(() => console.log('✅ Database OK'))
  .catch(err => console.log('❌ Database Error:', err.message))
  .finally(() => process.exit(0));
"
```

### 2. Test des APIs Programme
```bash
cd backend
node test-programme-api.js
```

### 3. Vérification des Dépendances
```bash
# Backend
cd backend
npm list --depth=0

# Frontend
cd frontend
npm list --depth=0
```

## 📋 Checklist de Démarrage

### Backend
- [ ] Base de données MySQL démarrée
- [ ] Variables d'environnement configurées (`.env`)
- [ ] Dépendances installées (`npm install`)
- [ ] Serveur démarré (`npm start`)
- [ ] APIs testées (`node test-programme-api.js`)

### Frontend
- [ ] Dépendances installées (`npm install`)
- [ ] Serveur de développement démarré (`npm run dev`)
- [ ] Pas d'erreurs dans la console
- [ ] Imports corrigés (voir section 1)

### Données
- [ ] Modules existent dans la base
- [ ] Établissements régionaux existent
- [ ] Programmes de test ajoutés (`node seed-programme-data.js`)

## 🔍 Debugging Avancé

### 1. Logs Détaillés Backend
```javascript
// Dans backend/server.js, ajouter :
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### 2. Logs Détaillés Frontend
```typescript
// Dans les composants, ajouter :
console.log('API Response:', response.data);
```

### 3. Vérification des Routes
```bash
# Vérifier que les routes sont enregistrées
curl http://localhost:3000/programme
```

## 📞 Support

Si les problèmes persistent :

1. **Vérifiez les logs** du serveur backend
2. **Ouvrez la console** du navigateur
3. **Testez les APIs** individuellement
4. **Vérifiez la base de données** directement

## 🎯 URLs de Test

- **Backend API :** `http://localhost:3000`
- **Frontend :** `http://localhost:5173`
- **Swagger Docs :** `http://localhost:3000/api-docs`

---

**💡 Conseil :** Commencez toujours par vérifier que le backend fonctionne avant de déboguer le frontend !
