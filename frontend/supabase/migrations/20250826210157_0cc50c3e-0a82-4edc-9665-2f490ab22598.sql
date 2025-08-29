-- Corriger les politiques RLS pour permettre la création automatique de profils utilisateurs

-- Supprimer l'ancienne politique restrictive pour l'insertion
DROP POLICY IF EXISTS "Users can create their own profile" ON public.user_profiles;

-- Créer une nouvelle politique plus permissive pour l'insertion
-- Cette politique permet aux utilisateurs authentifiés de créer leur profil
-- et aussi aux fonctions système (comme les triggers) de créer des profils
CREATE POLICY "Users can create profiles" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR 
  auth.role() = 'service_role'
);

-- Ajouter une politique pour permettre aux triggers et fonctions système 
-- de mettre à jour les profils lors de la création
CREATE POLICY "System can manage profiles during signup" 
ON public.user_profiles 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);