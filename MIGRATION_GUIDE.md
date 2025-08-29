# Guide de Migration Frontend Supabase → Backend Node.js

## Vue d'ensemble

Ce guide détaille la migration complète du frontend de Supabase vers notre backend Node.js/Sequelize/MySQL, en conservant toutes les fonctionnalités existantes.

## Architecture Backend Créée

### Contrôleurs Implémentés

1. **AuthController** - Authentification et gestion des sessions
2. **UserController** - Gestion des profils utilisateurs
3. **CoursController** - Gestion des cours
4. **MemoireController** - Gestion des mémoires
5. **OffreController** - Gestion des offres de formation
6. **InscriptionController** - Gestion des inscriptions

### Routes API Disponibles

#### Authentification (`/auth`)
- `POST /auth/login` - Connexion
- `POST /auth/logout` - Déconnexion
- `POST /auth/signup` - Inscription générale
- `POST /auth/register/stagiaire` - Inscription stagiaire
- `POST /auth/register/enseignant` - Inscription enseignant
- `POST /auth/password` - Changement de mot de passe

#### Utilisateur (`/user`)
- `GET /user/profile` - Récupérer le profil
- `PUT /user/profile` - Mettre à jour le profil

#### Cours (`/cours`)
- `GET /cours` - Tous les cours approuvés
- `GET /cours/enseignant/:id` - Cours d'un enseignant
- `POST /cours` - Créer un cours (Enseignant)
- `PUT /cours/:id` - Modifier un cours (Enseignant)
- `DELETE /cours/:id` - Supprimer un cours (Enseignant)

#### Mémoires (`/memoire`)
- `GET /memoire/stagiaire/:id` - Mémoires d'un stagiaire
- `GET /memoire/enseignant/:id` - Mémoires d'un enseignant
- `POST /memoire` - Créer un mémoire
- `PUT /memoire/:id` - Modifier un mémoire
- `DELETE /memoire/:id` - Supprimer un mémoire
- `PUT /memoire/:id/status` - Changer le statut

#### Offres (`/offre`)
- `GET /offre` - Toutes les offres
- `GET /offre/etablissement/:id` - Offres d'un établissement
- `POST /offre` - Créer une offre (EtablissementFormation)
- `PUT /offre/:id` - Modifier une offre (EtablissementFormation)
- `DELETE /offre/:id` - Supprimer une offre (EtablissementFormation)

#### Inscriptions (`/inscription`)
- `GET /inscription/stagiaire/:id` - Inscriptions d'un stagiaire
- `POST /inscription` - Créer une inscription (Stagiaire)
- `PUT /inscription/:id/status` - Changer le statut (EtablissementFormation)
- `DELETE /inscription/:id` - Supprimer une inscription

## Migration Frontend

### 1. Service API (`src/services/api.ts`)

Le service API remplace tous les appels Supabase :

```typescript
// Remplacer
import { supabase } from '@/integrations/supabase/client';
const { data, error } = await supabase.from('cours').select('*');

// Par
import { apiService } from '@/services/api';
const { data, error } = await apiService.getAllCours();
```

### 2. Hook d'Authentification (`src/hooks/useAuthApi.tsx`)

Remplacer `useAuth` par `useAuthApi` :

```typescript
// Remplacer
import { useAuth } from '@/hooks/useAuth';

// Par
import { useAuthApi } from '@/hooks/useAuthApi';
```

### 3. Migration des Composants

#### Exemple : CoursView

**Avant (Supabase) :**
```typescript
const fetchCours = async () => {
  const { data, error } = await supabase
    .from('cours')
    .select(`
      id_cours,
      code_cours,
      titre_fr,
      titre_ar,
      fichierpdf,
      status,
      observation,
      module:id_module(designation_fr, designation_ar),
      enseignant:id_enseignant(nom_fr, prenom_fr)
    `)
    .eq('status', 'مقبول');
  
  if (error) throw error;
  setCours(data || []);
};
```

**Après (API Node.js) :**
```typescript
const fetchCours = async () => {
  const { data, error } = await apiService.getAllCours();
  
  if (error) throw error;
  setCours(data || []);
};
```

### 4. Mise à jour du Provider Principal

Dans `App.tsx`, remplacer `AuthProvider` par `AuthApiProvider` :

```typescript
// Remplacer
import { AuthProvider } from '@/hooks/useAuth';

// Par
import { AuthApiProvider } from '@/hooks/useAuthApi';

// Et dans le JSX
<AuthApiProvider>
  {/* ... */}
</AuthApiProvider>
```

## Étapes de Migration Complète

### Étape 1 : Préparation
1. Sauvegarder le code existant
2. Installer les nouvelles dépendances si nécessaire
3. Vérifier que le backend fonctionne sur `http://localhost:3000`

### Étape 2 : Migration des Services
1. Copier `src/services/api.ts` dans le projet
2. Tester les appels API de base

### Étape 3 : Migration de l'Authentification
1. Remplacer `useAuth` par `useAuthApi`
2. Mettre à jour `App.tsx` avec `AuthApiProvider`
3. Tester la connexion/déconnexion

### Étape 4 : Migration des Composants
1. **StagiaireDashboard** - Remplacer les appels Supabase
2. **EnseignantDashboard** - Remplacer les appels Supabase
3. **CoursView** - Utiliser `apiService.getAllCours()`
4. **MemoireView** - Utiliser `apiService.getMemoiresByStagiaire()`

### Étape 5 : Tests et Validation
1. Tester toutes les fonctionnalités
2. Vérifier que l'UI reste identique
3. Valider les permissions et rôles

## Correspondance des Fonctionnalités

| Fonctionnalité Supabase | API Node.js | Statut |
|-------------------------|-------------|---------|
| `supabase.auth.signInWithPassword` | `apiService.login()` | ✅ |
| `supabase.auth.signUp` | `apiService.signup()` | ✅ |
| `supabase.auth.signOut` | `apiService.logout()` | ✅ |
| `supabase.from('user_profiles')` | `apiService.getUserProfile()` | ✅ |
| `supabase.from('cours')` | `apiService.getAllCours()` | ✅ |
| `supabase.from('memoire')` | `apiService.getMemoiresByStagiaire()` | ✅ |
| `supabase.from('offre')` | `apiService.getAllOffres()` | ✅ |
| `supabase.from('inscription')` | `apiService.getInscriptionsByStagiaire()` | ✅ |

## Gestion des Erreurs

Les erreurs sont gérées de manière cohérente :

```typescript
const { data, error } = await apiService.getAllCours();

if (error) {
  toast({
    title: "خطأ",
    description: "فشل في تحميل البيانات",
    variant: "destructive",
  });
  return;
}

setData(data);
```

## Sécurité et Authentification

- **JWT Tokens** : Stockés dans `localStorage`
- **Middleware** : Vérification automatique des rôles
- **CORS** : Configuré pour permettre les requêtes frontend
- **Validation** : Côté serveur et client

## Déploiement

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Support et Maintenance

- **Documentation API** : Disponible sur `http://localhost:3000/api-docs`
- **Logs** : Console du serveur Node.js
- **Base de données** : MySQL avec Sequelize ORM

## Notes Importantes

1. **Pas de changement d'UI** : L'interface utilisateur reste identique
2. **Compatibilité** : Tous les types TypeScript sont préservés
3. **Performance** : Les requêtes sont optimisées avec Sequelize
4. **Évolutivité** : Architecture modulaire pour ajouts futurs

## Prochaines Étapes

1. Migrer progressivement chaque composant
2. Tester chaque fonctionnalité
3. Valider les permissions utilisateur
4. Optimiser les performances si nécessaire
5. Ajouter des fonctionnalités supplémentaires

