# Guide d'implémentation de la table OffreModule

## Vue d'ensemble

Ce guide explique l'implémentation de la table `OffreModule` qui gère la relation many-to-many entre les offres de formation et les modules. Cette implémentation permet aux stagiaires de ne voir que les modules spécifiquement associés à leurs offres d'inscription, plutôt que tous les modules de leurs spécialités.

## Architecture

### Structure de la base de données

```
Offre (1) ←→ (N) OffreModule (N) ←→ (1) Module
```

- **Offre** : Représente une offre de formation spécifique
- **OffreModule** : Table d'association qui lie les offres aux modules
- **Module** : Module de cours appartenant à une spécialité

### Relations

1. **Offre → Spécialité** : Une offre appartient à une spécialité
2. **Module → Spécialité** : Un module appartient à une spécialité
3. **Offre ↔ Module** : Relation many-to-many via OffreModule
4. **Stagiaire → Offre** : Via la table Inscription

## Implémentation

### 1. Modèle OffreModule

Le modèle `OffreModule` est défini dans `backend/models/OffreModule.js` avec :

- **Validation automatique** : Hook qui vérifie la cohérence entre l'offre et le module
- **Contraintes de base de données** : Clés étrangères avec CASCADE
- **Index** : Pour optimiser les performances des requêtes

### 2. Associations Sequelize

Les associations sont définies dans `backend/models/associations.js` :

```javascript
// Offre <-> Module (relation N:N via OffreModule)
Offre.belongsToMany(Module, {
  through: "OffreModule",
  foreignKey: "id_offre",
  otherKey: "id_module"
});

Module.belongsToMany(Offre, {
  through: "OffreModule",
  foreignKey: "id_module",
  otherKey: "id_offre"
});
```

### 3. Modification du contrôleur

Le contrôleur `CoursController.getCoursByStagiaire` a été modifié pour :

- Récupérer les offres du stagiaire via ses inscriptions
- Utiliser la table `OffreModule` pour obtenir les modules spécifiques
- Maintenir la logique de filtrage par établissement et statut

## Utilisation

### Scripts fournis

#### 1. Création de la table
```bash
# Exécuter le script SQL
psql -d votre_base -f create-offre-module-table.sql
```

#### 2. Peuplement de la table
```bash
# Exécuter le script de peuplement
node populate-offre-module.js
```

#### 3. Test de la fonctionnalité
```bash
# Vérifier que tout fonctionne
node test-offre-module.js
```

### Workflow typique

1. **Création d'une offre** : L'offre est créée avec une spécialité
2. **Association des modules** : Les modules de la spécialité sont automatiquement associés
3. **Inscription d'un stagiaire** : Le stagiaire s'inscrit à l'offre
4. **Récupération des cours** : Seuls les modules de l'offre sont visibles

## Avantages

### 1. Flexibilité
- Une offre peut utiliser une sélection personnalisée de modules
- Possibilité d'ajouter/supprimer des modules spécifiques à une offre

### 2. Cohérence
- Validation automatique que les modules appartiennent à la bonne spécialité
- Contraintes de base de données pour maintenir l'intégrité

### 3. Performance
- Requêtes plus ciblées pour les stagiaires
- Index optimisés pour les jointures

### 4. Évolutivité
- Facilite l'ajout de nouvelles fonctionnalités (ex: modules optionnels)
- Structure extensible pour de futurs besoins

## Gestion des erreurs

### Validation des données
- Le hook Sequelize vérifie la cohérence avant la création
- Erreurs explicites en cas de problème de cohérence

### Gestion des cas limites
- Vérification de l'existence des offres et modules
- Gestion des suppressions en cascade

## Maintenance

### Surveillance
- Vérifier régulièrement la cohérence des données
- Monitorer les performances des requêtes

### Sauvegarde
- Inclure la table `OffreModule` dans les sauvegardes
- Documenter les changements de structure

## Tests

### Tests unitaires
- Validation des associations
- Gestion des erreurs
- Performance des requêtes

### Tests d'intégration
- Workflow complet stagiaire → offre → module → cours
- Cohérence des données

## Dépannage

### Problèmes courants

1. **Erreur de cohérence** : Vérifier que l'offre et le module ont la même spécialité
2. **Performance lente** : Vérifier l'existence des index
3. **Données manquantes** : Exécuter le script de peuplement

### Logs utiles
- Vérifier les logs du contrôleur `getCoursByStagiaire`
- Surveiller les erreurs de validation du modèle

## Conclusion

L'implémentation de la table `OffreModule` améliore significativement la flexibilité et la cohérence du système de gestion des formations. Elle permet aux stagiaires d'accéder uniquement aux modules pertinents pour leurs offres d'inscription, tout en maintenant l'intégrité des données.
