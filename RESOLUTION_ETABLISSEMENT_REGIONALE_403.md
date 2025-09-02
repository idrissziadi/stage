# 🔧 Résolution de l'erreur 403 - Établissement Régional

## 🚨 Problème identifié

L'erreur `GET http://localhost:3000/etablissement/0/enseignants?limit=1000 403 (Forbidden)` indique que :

1. **L'ID de l'établissement est 0** (incorrect)
2. **L'utilisateur n'a pas les permissions** pour accéder à cet endpoint
3. **L'API est appelée sur le mauvais port** (3000 au lieu de 3001)

## 🔍 Analyse du problème

### 1. **Port incorrect**
- **Frontend** : Port 3000 (correct)
- **Backend** : Port 3001 (correct)
- **Problème** : L'API est appelée sur le port 3000 au lieu de 3001

### 2. **ID d'établissement incorrect**
- **Valeur actuelle** : `0` (incorrect)
- **Valeur attendue** : `userProfile.id_etab_regionale` (ex: 1, 2, 3...)

### 3. **Permissions insuffisantes**
- **Route** : `/etablissement/:id_etab_formation/enseignants`
- **Middleware** : `isAuth` (requiert authentification)
- **Problème** : L'ID 0 n'est pas valide

## 🛠️ Solutions appliquées

### 1. **Correction de l'ID d'établissement**

```typescript
// Avant (problématique)
const enseignantsResponse = await apiService.getEnseignantsByEtablissement(0, '', 1000, 0);

// Après (corrigé)
if (userProfile?.id_etab_regionale) {
  const enseignantsResponse = await apiService.getEnseignantsByEtablissement(userProfile.id_etab_regionale, '', 1000, 0);
  setEnseignants(enseignantsResponse.data || []);
} else {
  console.warn('No id_etab_regionale found in userProfile');
  setEnseignants([]);
}
```

### 2. **Vérification du profil utilisateur**

```typescript
// Vérification avant chargement des données
useEffect(() => {
  if (userProfile?.id_etab_regionale) {
    fetchData();
  }
}, [userProfile]);

// Vérification de l'interface
if (!userProfile?.id_etab_regionale) {
  return (
    <div className="text-center py-12">
      <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">خطأ في البيانات</h3>
      <p className="text-gray-600 mb-4">
        لم يتم العثور على معرف المؤسسة الإقليمية. يرجى إعادة تسجيل الدخول.
      </p>
      <Button onClick={() => window.location.reload()}>
        <RefreshCw className="w-4 h-4 mr-2" />
        إعادة تحميل الصفحة
      </Button>
    </div>
  );
}
```

### 3. **Informations de débogage**

```typescript
// Ajout d'informations de débogage
<Card className="mb-4 border-orange-200 bg-orange-50">
  <CardContent className="p-4">
    <div className="text-sm text-gray-600">
      <p><strong>Debug Info:</strong></p>
      <p>User Role: {userProfile?.role}</p>
      <p>ID Etablissement Regional: {userProfile?.id_etab_regionale || 'Not found'}</p>
      <p>Username: {userProfile?.username}</p>
      <p>Loading: {loading ? 'Yes' : 'No'}</p>
    </div>
  </CardContent>
</Card>
```

## 🧪 Tests de diagnostic

### 1. **Vérification du profil utilisateur**

```typescript
// Dans la console du navigateur
console.log('User Profile:', userProfile);
console.log('ID Etablissement Regional:', userProfile?.id_etab_regionale);
console.log('User Role:', userProfile?.role);
```

### 2. **Vérification de l'API**

```bash
# Test avec un ID valide
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3001/etablissement/1/enseignants?limit=10

# Test avec l'ID 0 (doit échouer)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3001/etablissement/0/enseignants?limit=10
```

### 3. **Vérification de la base de données**

```sql
-- Vérifier les établissements régionaux
SELECT * FROM EtablissementRegionale;

-- Vérifier l'utilisateur connecté
SELECT * FROM Compte WHERE username = 'USERNAME';

-- Vérifier les enseignants
SELECT * FROM Enseignant;
```

## 🔄 Workflow de résolution

### 1. **Vérifier l'authentification**

```typescript
// Vérifier que l'utilisateur est connecté
if (!userProfile) {
  console.log('User not authenticated');
  return;
}

// Vérifier le rôle
if (userProfile.role !== 'EtablissementRegionale') {
  console.log('User is not EtablissementRegionale');
  return;
}
```

### 2. **Vérifier l'ID d'établissement**

```typescript
// Vérifier que l'ID existe
if (!userProfile.id_etab_regionale) {
  console.log('No id_etab_regionale found');
  return;
}

// Vérifier que l'ID est valide
if (userProfile.id_etab_regionale <= 0) {
  console.log('Invalid id_etab_regionale:', userProfile.id_etab_regionale);
  return;
}
```

### 3. **Gérer les erreurs API**

```typescript
try {
  const response = await apiService.getEnseignantsByEtablissement(
    userProfile.id_etab_regionale, 
    '', 
    1000, 
    0
  );
  
  if (response.error) {
    console.error('API Error:', response.error);
    setEnseignants([]);
    return;
  }
  
  setEnseignants(response.data || []);
} catch (error) {
  console.error('Network Error:', error);
  setEnseignants([]);
}
```

## 📋 Checklist de vérification

- [ ] **Backend démarré** sur le port 3001
- [ ] **Frontend démarré** sur le port 3000
- [ ] **Utilisateur connecté** avec un token valide
- [ ] **Rôle correct** : `EtablissementRegionale`
- [ ] **ID d'établissement** présent et valide
- [ ] **Base de données** accessible
- [ **Logs backend** sans erreurs
- [ ] **Logs frontend** dans la console

## 🎯 Prochaines étapes

1. **Vérifier l'authentification** et le profil utilisateur
2. **Tester l'API** avec un ID valide
3. **Vérifier la base de données** pour les données de test
4. **Tester le composant** avec les informations de débogage

## 📞 Support

En cas de problème persistant :
1. Vérifiez les logs du backend
2. Vérifiez la console du navigateur
3. Vérifiez le token JWT dans le localStorage
4. Vérifiez la structure de la base de données

## 🔍 Debug avancé

### **Vérification du token JWT**

```typescript
// Décoder le token JWT
const token = localStorage.getItem('token');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('JWT Payload:', payload);
  console.log('ID Etablissement Regional in JWT:', payload.id_etab_regionale);
}
```

### **Vérification des routes**

```typescript
// Vérifier que la route est correcte
const endpoint = `/etablissement/${userProfile.id_etab_regionale}/enseignants`;
console.log('API Endpoint:', endpoint);
```
