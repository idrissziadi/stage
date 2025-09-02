-- Script de création de la table OffreModule
-- Cette table gère la relation many-to-many entre Offre et Module

-- Vérifier si la table existe déjà
CREATE TABLE IF NOT EXISTS "OffreModule" (
  "id_offre" INTEGER NOT NULL,
  "id_module" INTEGER NOT NULL,
  PRIMARY KEY ("id_offre", "id_module"),
  CONSTRAINT "OffreModule_id_offre_fkey" FOREIGN KEY ("id_offre") REFERENCES "Offre" ("id_offre") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "OffreModule_id_module_fkey" FOREIGN KEY ("id_module") REFERENCES "Module" ("id_module") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS "idx_offre_module_id_offre" ON "OffreModule" ("id_offre");
CREATE INDEX IF NOT EXISTS "idx_offre_module_id_module" ON "OffreModule" ("id_module");

-- Ajouter une contrainte de cohérence pour s'assurer que les modules appartiennent à la même spécialité que l'offre
-- Cette contrainte sera vérifiée au niveau de l'application via le hook Sequelize

-- Commentaire sur la table
COMMENT ON TABLE "OffreModule" IS 'Table d''association entre Offres et Modules. Un module peut être associé à plusieurs offres et une offre peut avoir plusieurs modules.';

-- Commentaires sur les colonnes
COMMENT ON COLUMN "OffreModule"."id_offre" IS 'Référence vers l''offre de formation';
COMMENT ON COLUMN "OffreModule"."id_module" IS 'Référence vers le module de la spécialité';
