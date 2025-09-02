# 📚 Documentation API avec Swagger

## 🚀 Accès à la documentation

Une fois le serveur backend démarré, accédez à la documentation interactive de l'API :

**URL :** `http://localhost:3000/api-docs`

## 🔧 Configuration Swagger

Le fichier `backend/swagger.js` contient la configuration complète de Swagger avec :

- **OpenAPI 3.0.0** - Standard moderne pour la documentation d'API
- **Schémas de données** - Modèles complets pour tous les entités
- **Authentification JWT** - Support des tokens Bearer
- **Tags organisés** - Endpoints groupés par fonctionnalité
- **Réponses standardisées** - Codes d'erreur et formats de réponse

## 📋 Endpoints documentés

### 🔐 Authentification (Auth)
- `POST /auth/login` - Connexion utilisateur
- `POST /auth/logout` - Déconnexion
- `POST /auth/register/stagiaire` - Création compte stagiaire
- `POST /auth/register/enseignant` - Création compte enseignant

### 👥 Utilisateurs (Users)
- Gestion des profils utilisateurs
- Rôles et permissions

### 📚 Programmes (Programmes)
- Création et gestion des programmes de formation
- Statuts et approbations

### 🎓 Cours (Cours)
- Gestion des cours par programme
- Association avec les modules

### 🧩 Modules (Modules)
- Gestion des modules de formation
- Spécialités et durées

### 🏫 Établissements (Etablissements)
- Gestion des établissements nationaux et régionaux
- Types et informations de contact

### 💼 Offres (Offres)
- Gestion des offres de modules
- Prix et statuts

### 📝 Inscriptions (Inscriptions)
- Gestion des inscriptions aux programmes
- Statuts et validation

## 🛠️ Utilisation de la documentation

### 1. **Exploration interactive**
- Naviguez entre les différents endpoints
- Consultez les schémas de données
- Testez les requêtes directement depuis l'interface

### 2. **Authentification**
- Utilisez le bouton "Authorize" pour tester avec un token JWT
- Format : `Bearer <votre_token_jwt>`

### 3. **Test des endpoints**
- Cliquez sur un endpoint pour l'étendre
- Cliquez sur "Try it out" pour tester
- Remplissez les paramètres requis
- Exécutez la requête et consultez la réponse

### 4. **Schémas de données**
- Consultez la section "Schemas" pour voir la structure des objets
- Comprenez les types de données et validations

## 🔒 Sécurité

- **JWT Bearer Token** requis pour la plupart des endpoints
- **Rôles utilisateur** : admin, enseignant, stagiaire, établissement
- **Permissions** basées sur le rôle et l'établissement

## 📱 Exemples d'utilisation

### Connexion utilisateur
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user@example.com", "password": "password123"}'
```

### Création d'un programme (avec authentification)
```bash
curl -X POST http://localhost:3000/programme \
  -H "Authorization: Bearer <votre_token>" \
  -H "Content-Type: application/json" \
  -d '{"titre": "Formation Développement Web", "description": "Formation complète", "duree": "6 mois"}'
```

## 🚨 Codes de réponse

- **200** - Succès
- **201** - Créé avec succès
- **400** - Requête invalide
- **401** - Non authentifié
- **403** - Accès refusé
- **404** - Ressource non trouvée
- **409** - Conflit (ex: doublon)
- **500** - Erreur serveur

## 🔄 Mise à jour de la documentation

Pour ajouter de nouveaux endpoints :

1. **Ajoutez les annotations Swagger** dans vos fichiers de routes
2. **Définissez les schémas** dans `swagger.js` si nécessaire
3. **Redémarrez le serveur** pour voir les changements

### Exemple d'annotation Swagger
```javascript
/**
 * @swagger
 * /api/example:
 *   get:
 *     summary: Description de l'endpoint
 *     tags: [Tag]
 *     responses:
 *       200:
 *         description: Succès
 */
```

## 🌐 Accès en production

En production, la documentation sera disponible sur :
`https://api.formation.gov.ma/api-docs`

---

**💡 Conseil :** Utilisez la documentation Swagger pour tester et comprendre l'API avant d'intégrer dans vos applications !
