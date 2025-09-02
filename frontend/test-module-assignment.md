# 🧪 Guide de test - Assignation des modules aux enseignants

## 🎯 Objectif du test

Vérifier que la fonctionnalité d'assignation des modules aux enseignants fonctionne correctement dans l'interface frontend.

## 🔧 Prérequis

1. **Backend démarré** sur le port 3001
2. **Frontend démarré** sur le port 3000
3. **Base de données** avec des données de test
4. **Token d'authentification** valide pour un établissement de formation

## 📋 Étapes de test

### 1. **Connexion et navigation**
- [ ] Se connecter avec un compte d'établissement de formation
- [ ] Naviguer vers le tableau de bord de l'établissement
- [ ] Cliquer sur l'onglet "إدارة المستخدمين" (Gestion des utilisateurs)
- [ ] Vérifier que l'onglet "الأساتذة" (Enseignants) est visible

### 2. **Vérification de l'interface**
- [ ] Vérifier que la liste des enseignants s'affiche
- [ ] Vérifier que chaque enseignant a un bouton "تعيين الوحدات" (Assigner des modules)
- [ ] Vérifier que le bouton n'apparaît que pour les enseignants

### 3. **Test d'ouverture du dialogue**
- [ ] Cliquer sur "تعيين الوحدات" pour un enseignant
- [ ] Vérifier que le dialogue s'ouvre
- [ ] Vérifier que le titre affiche le nom de l'enseignant
- [ ] Vérifier que les modules disponibles se chargent

### 4. **Test de récupération des modules**
- [ ] Vérifier que seuls les modules des spécialités des offres de l'établissement sont affichés
- [ ] Vérifier que chaque module affiche :
  - Code du module
  - Désignation française
  - Spécialité

### 5. **Test d'assignation de modules**
- [ ] Sélectionner une année scolaire (ex: 2024-09-01)
- [ ] Sélectionner un semestre (ex: S1)
- [ ] Cocher quelques modules
- [ ] Cliquer sur "تعيين الوحدات المختارة"
- [ ] Vérifier le message de succès
- [ ] Vérifier que les modules apparaissent dans la liste des modules assignés

### 6. **Test de gestion des modules assignés**
- [ ] Vérifier que les modules assignés s'affichent groupés par année
- [ ] Vérifier que chaque module affiche :
  - Code et désignation
  - Spécialité et semestre
  - Bouton de suppression

### 7. **Test de suppression de module**
- [ ] Cliquer sur "إزالة" (Supprimer) pour un module
- [ ] Vérifier le message de succès
- [ ] Vérifier que le module disparaît de la liste

### 8. **Test de validation des données**
- [ ] Essayer d'assigner des modules sans sélectionner d'année scolaire
- [ ] Vérifier que le message d'erreur s'affiche
- [ ] Essayer d'assigner des modules sans en sélectionner
- [ ] Vérifier que le message d'erreur s'affiche

## 🚨 Cas d'erreur à tester

### **Erreur d'authentification**
- [ ] Tester avec un token expiré
- [ ] Vérifier que l'erreur 401 est gérée

### **Erreur de données**
- [ ] Tester avec un enseignant sans établissement
- [ ] Vérifier que l'erreur est gérée

### **Erreur de réseau**
- [ ] Tester avec le backend arrêté
- [ ] Vérifier que l'erreur est gérée

## 📊 Données de test recommandées

### **Enseignant de test**
- ID: 1
- Nom: Dupont
- Prénom: Jean
- Établissement: Institut de Formation

### **Modules de test**
- Module 1: MATH101 - Mathématiques de base
- Module 2: INFO101 - Informatique de base
- Module 3: PHYS101 - Physique de base

### **Années scolaires de test**
- 2024-09-01
- 2025-09-01

## ✅ Critères de succès

1. **Interface utilisateur**
   - [ ] Tous les éléments s'affichent correctement
   - [ ] Les textes sont en arabe et français
   - [ ] La mise en page est responsive

2. **Fonctionnalité**
   - [ ] Les modules disponibles se chargent
   - [ ] L'assignation fonctionne
   - [ ] La suppression fonctionne
   - [ ] Les erreurs sont gérées

3. **Performance**
   - [ ] Les requêtes se terminent en moins de 3 secondes
   - [ ] L'interface reste réactive

4. **Sécurité**
   - [ ] Seuls les modules autorisés sont affichés
   - [ ] L'authentification est respectée

## 🐛 Problèmes connus

- Aucun problème connu pour le moment

## 📝 Notes de test

- Tester avec différents navigateurs (Chrome, Firefox, Safari)
- Tester sur mobile et desktop
- Vérifier la gestion des caractères spéciaux en arabe

## 🔄 Réexécution des tests

En cas d'échec, vérifier :
1. La connexion à la base de données
2. Les logs du backend
3. Les logs du navigateur (Console)
4. L'état de l'authentification
