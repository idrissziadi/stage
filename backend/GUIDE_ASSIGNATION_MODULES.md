# 📚 Guide d'utilisation - Assignation des modules aux enseignants

## 🎯 Objectif

Ce guide explique comment utiliser l'API pour assigner des modules aux enseignants, en respectant la logique métier suivante :

**Un enseignant ne peut être assigné qu'aux modules qui appartiennent aux spécialités des offres existantes dans son établissement de formation.**

## 🔗 Endpoints disponibles

### 1. Récupérer les modules disponibles pour un enseignant

```
GET /ens-module/enseignant/{id_enseignant}/modules-disponibles
```

**Description :** Récupère tous les modules que l'enseignant peut enseigner, basés sur les spécialités des offres de son établissement.

**Paramètres :**
- `id_enseignant` (path) : ID de l'enseignant

**Réponse :**
```json
{
  "message": "Modules disponibles récupérés avec succès",
  "enseignant": {
    "id_enseignant": 1,
    "nom_fr": "Dupont",
    "prenom_fr": "Jean",
    "etablissement": {
      "id_etab_formation": 1,
      "nom_fr": "Institut de Formation",
      "nom_ar": "معهد التكوين"
    }
  },
  "offres": 5,
  "specialites": 3,
  "modules": [
    {
      "id_module": 1,
      "code_module": "MATH101",
      "designation_fr": "Mathématiques de base",
      "designation_ar": "الرياضيات الأساسية",
      "id_specialite": 1,
      "specialite": {
        "id_specialite": 1,
        "designation_fr": "Informatique",
        "designation_ar": "المعلوماتية"
      }
    }
  ]
}
```

### 2. Assigner des modules à un enseignant

```
POST /ens-module/enseignant/{id_enseignant}/assigner
```

**Description :** Assigne une liste de modules à un enseignant pour une année scolaire donnée.

**Paramètres :**
- `id_enseignant` (path) : ID de l'enseignant

**Body :**
```json
{
  "modules": [1, 2, 3],
  "annee_scolaire": "2024-09-01",
  "semestre": "S1"
}
```

**Champs :**
- `modules` (requis) : Array des IDs des modules à assigner
- `annee_scolaire` (requis) : Date de début de l'année scolaire (format YYYY-MM-DD)
- `semestre` (optionnel) : Semestre (S1, S2, S3, S4, Premier, Deuxième)

**Réponse :**
```json
{
  "message": "3 module(s) assigné(s) avec succès à l'enseignant",
  "enseignant": {
    "id_enseignant": 1,
    "nom_fr": "Dupont",
    "prenom_fr": "Jean",
    "etablissement": "Institut de Formation"
  },
  "annee_scolaire": "2024-09-01",
  "semestre": "S1",
  "modules_assigned": [
    {
      "id_module": 1,
      "code_module": "MATH101",
      "designation_fr": "Mathématiques de base"
    }
  ],
  "total_modules": 3
}
```

### 3. Récupérer les modules assignés à un enseignant

```
GET /ens-module/enseignant/{id_enseignant}/modules
```

**Description :** Récupère tous les modules assignés à un enseignant, groupés par année scolaire.

**Paramètres :**
- `id_enseignant` (path) : ID de l'enseignant
- `annee_scolaire` (query, optionnel) : Année scolaire spécifique

**Réponse :**
```json
{
  "message": "Modules de l'enseignant récupérés avec succès",
  "enseignant_id": 1,
  "modules_by_year": {
    "2024-09-01": [
      {
        "id_module": 1,
        "code_module": "MATH101",
        "designation_fr": "Mathématiques de base",
        "designation_ar": "الرياضيات الأساسية",
        "specialite": {
          "id_specialite": 1,
          "designation_fr": "Informatique",
          "designation_ar": "المعلوماتية"
        },
        "semestre": "S1",
        "assigned_at": "2024-01-15T10:30:00.000Z"
      }
    ]
  },
  "total_modules": 1
}
```

### 4. Retirer un module d'un enseignant

```
DELETE /ens-module/enseignant/{id_enseignant}/module/{id_module}/{annee_scolaire}
```

**Description :** Supprime l'assignation d'un module spécifique à un enseignant pour une année scolaire donnée.

**Paramètres :**
- `id_enseignant` (path) : ID de l'enseignant
- `id_module` (path) : ID du module
- `annee_scolaire` (path) : Année scolaire (format YYYY-MM-DD)

**Réponse :**
```json
{
  "message": "Module retiré de l'enseignant avec succès",
  "enseignant_id": 1,
  "module_id": 1,
  "annee_scolaire": "2024-09-01"
}
```

## 🔒 Logique de sécurité

### Vérifications effectuées

1. **Existence de l'enseignant** : L'enseignant doit exister dans la base de données
2. **Établissement assigné** : L'enseignant doit être assigné à un établissement de formation
3. **Offres existantes** : L'établissement doit avoir des offres actives ou en brouillon
4. **Modules autorisés** : Seuls les modules des spécialités des offres de l'établissement peuvent être assignés

### Exemple de flux de validation

```
Enseignant ID: 1
↓
Vérification: Existe et est assigné à l'établissement 5
↓
Récupération des offres de l'établissement 5
↓
Extraction des spécialités: [1, 3, 7]
↓
Vérification: Les modules demandés appartiennent à ces spécialités
↓
Assignation autorisée ✅
```

## 📝 Exemples d'utilisation

### Exemple 1: Assignation simple

```bash
curl -X POST http://localhost:3001/ens-module/enseignant/1/assigner \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "modules": [1, 2],
    "annee_scolaire": "2024-09-01",
    "semestre": "S1"
  }'
```

### Exemple 2: Récupération des modules disponibles

```bash
curl -X GET http://localhost:3001/ens-module/enseignant/1/modules-disponibles \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Exemple 3: Suppression d'une assignation

```bash
curl -X DELETE http://localhost:3001/ens-module/enseignant/1/module/1/2024-09-01 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🧪 Tests

### Script de test

Utilisez le script `test-ens-module.js` pour tester l'API :

```bash
# Installer axios si nécessaire
npm install axios

# Modifier le token dans le script
# Puis lancer les tests
node test-ens-module.js
```

### Tests manuels

1. **Test de récupération** : Vérifiez que seuls les modules des spécialités des offres de l'établissement sont retournés
2. **Test d'assignation** : Vérifiez que l'assignation est créée en base
3. **Test de validation** : Essayez d'assigner un module d'une autre spécialité (doit échouer)
4. **Test de suppression** : Vérifiez que l'assignation est bien supprimée

## ⚠️ Points d'attention

### Contraintes techniques

1. **Clé primaire composite** : La table `Ens_Module` a une clé primaire sur `(id_module, id_enseignant, annee_scolaire)`
2. **Suppression en cascade** : L'assignation d'un module supprime automatiquement les anciennes assignations pour la même année scolaire
3. **Validation des dates** : L'année scolaire doit être au format YYYY-MM-DD

### Gestion des erreurs

- **400** : Données invalides ou modules non autorisés
- **401** : Token d'authentification manquant ou invalide
- **404** : Enseignant ou assignation non trouvé
- **500** : Erreur serveur interne

## 🔄 Workflow recommandé

1. **Vérification** : Récupérez d'abord les modules disponibles
2. **Sélection** : Choisissez les modules à assigner
3. **Assignation** : Créez l'assignation avec l'année scolaire
4. **Vérification** : Récupérez les modules assignés pour confirmation
5. **Gestion** : Modifiez ou supprimez les assignations selon les besoins

## 📊 Structure de la base de données

### Table Ens_Module

```sql
CREATE TABLE Ens_Module (
  id_module INT NOT NULL,
  id_enseignant INT NOT NULL,
  annee_scolaire DATE NOT NULL,
  semestre VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_module, id_enseignant, annee_scolaire),
  FOREIGN KEY (id_module) REFERENCES Module(id_module),
  FOREIGN KEY (id_enseignant) REFERENCES Enseignant(id_enseignant)
);
```

### Relations

- **Enseignant** ↔ **Module** (Many-to-Many via Ens_Module)
- **Module** → **Specialite** (Many-to-One)
- **Offre** → **Specialite** (Many-to-One)
- **Offre** → **EtablissementFormation** (Many-to-One)
- **Enseignant** → **EtablissementFormation** (Many-to-One)

## 🎉 Conclusion

Cette API permet une gestion sécurisée et logique de l'assignation des modules aux enseignants, en respectant les contraintes métier de votre système de formation. Elle garantit que chaque enseignant ne peut enseigner que les modules pertinents pour son établissement.
