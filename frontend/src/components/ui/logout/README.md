# Composants de Déconnexion

Ce dossier contient des composants de déconnexion améliorés avec une UI moderne et des animations fluides.

## Composants Disponibles

### 1. LogoutCard

Une carte de déconnexion complète avec informations utilisateur et bouton de déconnexion.

```tsx
import { LogoutCard } from '@/components/ui/logout';

<LogoutCard 
  onLogout={() => handleLogout()}
  username="john.doe"
  role="stagiaire"
  className="custom-class"
/>
```

**Props:**
- `onLogout`: Fonction appelée lors de la déconnexion
- `username`: Nom d'utilisateur (optionnel)
- `role`: Rôle de l'utilisateur (optionnel)
- `className`: Classes CSS personnalisées (optionnel)

### 2. FloatingLogoutButton

Un bouton de déconnexion avec plusieurs variantes et confirmation intégrée.

```tsx
import { FloatingLogoutButton } from '@/components/ui/logout';

// Variant par défaut
<FloatingLogoutButton 
  onLogout={() => handleLogout()}
/>

// Variant flottant
<FloatingLogoutButton 
  onLogout={() => handleLogout()}
  variant="floating"
/>

// Variant minimal
<FloatingLogoutButton 
  onLogout={() => handleLogout()}
  variant="minimal"
/>
```

**Props:**
- `onLogout`: Fonction appelée lors de la déconnexion
- `variant`: Type de bouton ('default' | 'floating' | 'minimal')
- `className`: Classes CSS personnalisées (optionnel)

## Variantes

### Default
- Bouton standard avec confirmation complète
- Icône avec animation de rotation
- Dialog de confirmation détaillé

### Floating
- Bouton flottant fixe en bas à droite
- Forme circulaire avec ombre
- Confirmation compacte

### Minimal
- Bouton simple et discret
- Confirmation rapide
- Idéal pour les headers et menus

## Caractéristiques

- ✅ Animations fluides et transitions
- ✅ Support RTL (arabe)
- ✅ Thème sombre/clair
- ✅ Responsive design
- ✅ Accessibilité intégrée
- ✅ Confirmation de sécurité
- ✅ Gradients et ombres modernes

## Utilisation

```tsx
import { LogoutCard, FloatingLogoutButton } from '@/components/ui/logout';

const MyComponent = () => {
  const handleLogout = () => {
    // Logique de déconnexion
    console.log('Déconnexion...');
  };

  return (
    <div>
      {/* Carte de déconnexion */}
      <LogoutCard 
        onLogout={handleLogout}
        username="user123"
        role="admin"
      />
      
      {/* Bouton flottant */}
      <FloatingLogoutButton 
        onLogout={handleLogout}
        variant="floating"
      />
    </div>
  );
};
```

## Personnalisation

Tous les composants supportent la personnalisation via les classes CSS :

```tsx
<LogoutCard 
  onLogout={handleLogout}
  className="my-custom-class bg-blue-100"
/>
```

## Support des Thèmes

Les composants s'adaptent automatiquement au thème actuel :
- **Clair**: Gradients doux et ombres légères
- **Sombre**: Couleurs adaptées et contrastes optimisés
