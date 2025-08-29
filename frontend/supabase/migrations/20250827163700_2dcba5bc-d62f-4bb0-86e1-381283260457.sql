-- Restructurer les tables inscription et offre - Version corrigée

-- 1. Renommer la table inscription vers offre
ALTER TABLE public.inscription RENAME TO offre;

-- 2. Supprimer la colonne id_stagiaire de la table offre
ALTER TABLE public.offre DROP COLUMN id_stagiaire;

-- 3. Ajouter une nouvelle colonne id_offre comme clé primaire auto-incrémentée
ALTER TABLE public.offre ADD COLUMN id_offre serial PRIMARY KEY;

-- 4. Supprimer les anciennes politiques RLS de la table (maintenant offre)
DROP POLICY IF EXISTS "Admin can manage Inscriptions" ON public.offre;
DROP POLICY IF EXISTS "Stagiaires can view their own Inscription" ON public.offre;

-- 5. Créer les nouvelles politiques RLS pour la table offre
CREATE POLICY "Admin can manage all Offres" 
ON public.offre 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE user_profiles.user_id = auth.uid() 
    AND user_profiles.role = 'admin'
  )
);

CREATE POLICY "Authenticated users can view Offres" 
ON public.offre 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- 6. Créer la nouvelle table inscription avec clé composite
CREATE TABLE public.inscription (
  id_stagiaire uuid NOT NULL REFERENCES public.stagiaire(id_stagiaire) ON DELETE CASCADE,
  id_offre integer NOT NULL REFERENCES public.offre(id_offre) ON DELETE CASCADE,
  date_inscription timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id_stagiaire, id_offre)
);

-- 7. Activer RLS sur la nouvelle table inscription
ALTER TABLE public.inscription ENABLE ROW LEVEL SECURITY;

-- 8. Créer les politiques RLS pour la nouvelle table inscription
CREATE POLICY "Admin can manage all Inscriptions" 
ON public.inscription 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE user_profiles.user_id = auth.uid() 
    AND user_profiles.role = 'admin'
  )
);

CREATE POLICY "Stagiaires can manage their own Inscriptions" 
ON public.inscription 
FOR ALL 
USING (auth.uid() = id_stagiaire);

-- 9. Créer un trigger pour mettre à jour updated_at
CREATE TRIGGER update_inscription_updated_at
  BEFORE UPDATE ON public.inscription
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_offre_updated_at
  BEFORE UPDATE ON public.offre
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();