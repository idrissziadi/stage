# Guide Complet - Création d'Établissement de Formation avec Stagiaire et Inscription Automatiques

## 🎯 Vue d'ensemble

Cette fonctionnalité permet de créer automatiquement un établissement de formation, un stagiaire et une inscription à une offre en une seule requête. C'est idéal pour les administrateurs qui veulent configurer rapidement un environnement de formation complet.

## 🚀 Endpoint

**POST** `/auth/signup/etablissement-formation`

## 📋 Paramètres de la requête

### Champs obligatoires
- `username` (string) : Nom d'utilisateur pour l'établissement
- `password` (string) : Mot de passe pour l'établissement
- `nom_fr` (string) : Nom de l'établissement en français
- `nom_ar` (string) : Nom de l'établissement en arabe

### Champs optionnels pour l'établissement
- `adresse_fr` (string) : Adresse de l'établissement en français
- `adresse_ar` (string) : Adresse de l'établissement en arabe
- `email` (string) : Email de l'établissement
- `telephone` (string) : Téléphone de l'établissement

### Champs optionnels pour le stagiaire
- `stagiaire_nom_fr` (string) : Nom du stagiaire en français
- `stagiaire_nom_ar` (string) : Nom du stagiaire en arabe
- `stagiaire_prenom_fr` (string) : Prénom du stagiaire en français
- `stagiaire_prenom_ar` (string) : Prénom du stagiaire en arabe
- `stagiaire_date_naissance` (date) : Date de naissance du stagiaire (format YYYY-MM-DD)
- `stagiaire_email` (string) : Email du stagiaire
- `stagiaire_telephone` (string) : Téléphone du stagiaire

### Champs optionnels pour l'offre
- `id_specialite` (integer) : ID de la spécialité pour l'offre
- `id_diplome` (integer) : ID du diplôme pour l'offre
- `id_mode` (integer) : ID du mode de formation pour l'offre

## 🔄 Processus automatique

Lors de la création, le système effectue automatiquement les étapes suivantes :

1. **Validation des données** : Vérification des champs obligatoires et des doublons
2. **Création du compte** : Création d'un compte avec le rôle `EtablissementFormation`
3. **Création de l'établissement** : Création de l'établissement de formation avec un code unique
4. **Création du stagiaire** : Création d'un stagiaire avec les données fournies ou des valeurs par défaut
5. **Recherche/Création d'offre** :
   - Si des paramètres d'offre sont fournis, recherche d'une offre correspondante
   - Sinon, recherche de la première offre active de l'établissement
   - Si aucune offre n'est trouvée, création d'une offre par défaut
6. **Création de l'inscription** : Inscription automatique du stagiaire à l'offre trouvée

## 📝 Exemples d'utilisation

### Exemple 1 : Création minimale
```json
{
  "username": "institut_test",
  "password": "password123",
  "nom_fr": "Institut de Formation Test",
  "nom_ar": "معهد التكوين التجريبي"
}
```

### Exemple 2 : Création complète
```json
{
  "username": "centre_formation",
  "password": "password456",
  "nom_fr": "Centre de Formation Avancé",
  "nom_ar": "مركز التكوين المتقدم",
  "adresse_fr": "123 Rue de la Formation, Ville Test",
  "adresse_ar": "١٢٣ شارع التكوين، مدينة التجربة",
  "email": "contact@formation-test.com",
  "telephone": "+212-5-1234-5678",
  "stagiaire_nom_fr": "Dupont",
  "stagiaire_nom_ar": "دوبون",
  "stagiaire_prenom_fr": "Jean",
  "stagiaire_prenom_ar": "جان",
  "stagiaire_date_naissance": "1995-06-15",
  "stagiaire_email": "jean.dupont@email.com",
  "stagiaire_telephone": "+212-6-1234-5678"
}
```

### Exemple 3 : Avec offre spécifique
```json
{
  "username": "ecole_specifique",
  "password": "password789",
  "nom_fr": "École de Formation Spécialisée",
  "nom_ar": "مدرسة التكوين المتخصصة",
  "id_specialite": 1,
  "id_diplome": 2,
  "id_mode": 1
}
```

## 📤 Réponse de l'API

### Succès (201)
```json
{
  "message": "Établissement de formation créé avec succès avec stagiaire et inscription",
  "etablissement": {
    "id_etab_formation": 123,
    "code": "INSTITUT_T",
    "nom_fr": "Institut de Formation Test",
    "nom_ar": "معهد التكوين التجريبي"
  },
  "stagiaire": {
    "id_stagiaire": 456,
    "nom_fr": "Stagiaire",
    "prenom_fr": "Par défaut"
  },
  "offre": {
    "id_offre": 789,
    "designation": "Formation - Diplôme"
  },
  "inscription": {
    "id_inscription": 101,
    "statut": "en_attente"
  }
}
```

### Erreurs possibles

#### 400 - Requête invalide
```json
{
  "message": "username, password, nom_fr, nom_ar sont requis"
}
```

#### 409 - Conflit
```json
{
  "message": "Nom d'utilisateur déjà pris"
}
```

#### 500 - Erreur serveur
```json
{
  "message": "Erreur serveur lors de la création de l'établissement de formation",
  "error": "Détails de l'erreur"
}
```

## 🧪 Tests

Un script de test complet est disponible : `test-etablissement-formation-complet.js`

Pour l'exécuter :
```bash
node test-etablissement-formation-complet.js
```

## 🔧 Configuration requise

### Base de données
- Tables : `Compte`, `EtablissementFormation`, `Stagiaire`, `Offre`, `Inscription`
- Tables de référence : `Specialite`, `Diplome`, `Mode_Formation`

### Modèles Sequelize
- Tous les modèles doivent être correctement configurés
- Les associations doivent être définies dans `associations.js`

## 🚨 Points d'attention

1. **Codes uniques** : Le système génère automatiquement un code unique basé sur le username
2. **Valeurs par défaut** : Si les données du stagiaire ne sont pas fournies, des valeurs par défaut sont utilisées
3. **Offres automatiques** : Si aucune offre n'est trouvée, une offre par défaut est créée automatiquement
4. **Validation des emails** : Les emails sont vérifiés pour éviter les doublons
5. **Statut d'inscription** : L'inscription est créée avec le statut "en_attente" par défaut

## 🔄 Workflow recommandé

1. **Préparation** : Rassemblez toutes les informations nécessaires
2. **Validation** : Vérifiez que les données sont cohérentes
3. **Création** : Envoyez la requête à l'API
4. **Vérification** : Vérifiez la réponse et les IDs générés
5. **Suivi** : Utilisez les IDs retournés pour le suivi ultérieur

## 📚 Cas d'usage

- **Configuration initiale** : Mise en place rapide d'un nouvel établissement
- **Tests et développement** : Création d'environnements de test complets
- **Migration de données** : Import en masse d'établissements existants
- **Démonstrations** : Présentation rapide du système

## 🆘 Dépannage

### Problèmes courants

1. **Erreur de validation** : Vérifiez que tous les champs obligatoires sont présents
2. **Conflit d'email** : Changez l'email ou vérifiez qu'il n'est pas déjà utilisé
3. **Erreur de base de données** : Vérifiez la connectivité et les permissions
4. **Modèles manquants** : Assurez-vous que tous les modèles sont importés

### Logs et débogage

Les erreurs sont loggées côté serveur avec des détails complets pour faciliter le débogage.

---

**Note** : Cette fonctionnalité est conçue pour simplifier la création d'environnements de formation complets. Elle automatise plusieurs processus qui seraient normalement effectués manuellement.
