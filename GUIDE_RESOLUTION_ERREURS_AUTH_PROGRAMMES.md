# 🔧 Guide de Résolution - Erreurs d'Authentification Programmes

## 🎯 Erreurs Identifiées et Solutions

### **1. Erreur 401 "Token invalide" lors de création de programmes** ✅

**Diagnostic** : Le backend fonctionne parfaitement, le problème vient du frontend.

**Tests Backend Validés** :
- ✅ Token généré correctement pour `etab_reg1`
- ✅ API création programmes fonctionnelle
- ✅ Middlewares d'authentification opérationnels
- ✅ Base de données accessible

**Causes Possibles Frontend** :
1. **Utilisateur mal connecté** - Pas avec un compte `EtablissementRegionale`
2. **Token expiré** - Session expirée depuis la connexion
3. **Token manquant** - localStorage vide ou corrompu
4. **Mauvais format token** - Token malformé ou incomplet

### **2. Erreur 404 pour téléchargement cours** ⚠️

**Problème** : `/api/etablissement-regionale/cours/1/download` n'existe pas
**Cause** : Route incorrecte ou non implémentée

### **3. Warning DialogContent sans Description** ⚠️

**Problème** : Dialog sans `Description` ou `aria-describedby`
**Solution** : Ajouter `DialogDescription` aux composants Dialog

## 🔧 Solutions Étape par Étape

### **Solution 1 : Vérification Token Frontend**

#### **A. Vérifier la Connexion**
```javascript
// Dans la console du navigateur
console.log('Token:', localStorage.getItem('token'));
console.log('User Role:', /* vérifier userProfile.role */);
```

#### **B. Se Reconnecter avec le Bon Compte**
**Identifiants Valides** :
- **Username** : `etab_reg1`
- **Password** : [mot de passe configuré]
- **Rôle attendu** : `EtablissementRegionale`

#### **C. Vérifier Token Contenu**
Le token doit contenir :
```json
{
  "id_compte": 5,
  "username": "etab_reg1", 
  "role": "EtablissementRegionale",
  "id_etab_regionale": 1,
  "iat": ...,
  "exp": ...
}
```

### **Solution 2 : Debug Frontend Avancé**

#### **A. Ajouter Logs de Debug**
```javascript
// Dans ProgrammeCreationFormWithUpload.tsx
const handleSubmit = async () => {
  const token = localStorage.getItem('token');
  console.log('🔍 Debug Token:', {
    exists: !!token,
    length: token?.length,
    starts: token?.substring(0, 20)
  });
  
  if (!token) {
    console.error('❌ Token manquant !');
    return;
  }
  
  // Essayer de décoder le token (côté client, pour debug)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('🔍 Token Payload:', payload);
  } catch (e) {
    console.error('❌ Token malformé:', e);
  }
}
```

#### **B. Test API Direct**
```javascript
// Test dans la console navigateur
fetch('http://localhost:3000/programme', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    code_programme: 'TEST-FRONTEND',
    titre_fr: 'Test Frontend',
    id_module: 1
  })
})
.then(res => res.json())
.then(data => console.log('✅ Réponse:', data))
.catch(err => console.error('❌ Erreur:', err));
```

### **Solution 3 : Corrections Immédiates**

#### **A. Amélioration Gestion Erreurs**
```javascript
// Déjà corrigé dans le composant
if (!token) {
  throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
}

if (!response.ok) {
  const errorData = await response.json();
  console.error('Erreur API:', errorData);
  throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
}
```

#### **B. DialogDescription Manquante**
Rechercher les Dialog sans Description :
```bash
grep -r "DialogContent" frontend/src --include="*.tsx" -A 5 -B 5
```

## 🧪 Tests de Validation

### **Test 1 : Connexion Correcte**
1. **Déconnexion** complète de l'application
2. **Connexion** avec `etab_reg1` 
3. **Vérification** du rôle affiché : `EtablissementRegionale`
4. **Test** création programme

### **Test 2 : Token Valide**
```javascript
// Console navigateur après connexion
const token = localStorage.getItem('token');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Role:', payload.role);
  console.log('ID Etab:', payload.id_etab_regionale);
  console.log('Expire:', new Date(payload.exp * 1000));
}
```

### **Test 3 : API Backend**
```bash
# Terminal (remplacer TOKEN par le vrai token)
curl -X POST http://localhost:3000/programme \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code_programme":"TEST","titre_fr":"Test","id_module":1}'
```

## 🎯 Checklist de Résolution

### **Frontend** ✅
- [ ] **Utilisateur connecté** avec `etab_reg1`
- [ ] **Rôle affiché** : `EtablissementRegionale`  
- [ ] **Token présent** dans localStorage
- [ ] **Token non expiré** (vérifier exp)
- [ ] **Payload complet** avec `id_etab_regionale`

### **Backend** ✅
- [x] **Serveur démarré** sur port 3000
- [x] **Base de données** accessible
- [x] **Associations** correctement configurées
- [x] **Middlewares auth** fonctionnels
- [x] **Routes programmes** disponibles

### **Réseau** ✅
- [ ] **CORS configuré** pour le frontend
- [ ] **Pas de proxy** bloquant les requêtes
- [ ] **Console réseau** sans erreurs CORS

## 🚀 Actions Immédiates

### **1. Déconnexion/Reconnexion**
```
1. Clic "تسجيل الخروج" 
2. Connexion avec "etab_reg1"
3. Vérifier rôle affiché
4. Test "إنشاء برنامج"
```

### **2. Vérification Token**
```javascript
// Console navigateur
localStorage.getItem('token')
// Doit retourner un long string JWT
```

### **3. Test API Simple**
```
1. Aller dans "إنشاء برنامج"
2. Remplir formulaire minimal
3. Observer console pour erreurs
4. Vérifier réponse API
```

---

## 🎉 **DIAGNOSTIC COMPLET !**

Le problème est côté frontend :

✅ **Backend** entièrement fonctionnel  
⚠️ **Frontend** problème d'authentification  
🎯 **Solution** : Reconnexion avec bon compte  

**Une fois reconnecté correctement, la création de programmes fonctionnera parfaitement !** 🚀
