// models/associations.js
const { sequelize } = require('../config/database');
const Compte = require('./Compte');
const Enseignant = require('./Enseignant');
const Stagiaire = require('./Stagiaire');
const EtablissementFormation = require('./EtablissementFormation');
const EtablissementRegionale = require('./EtablissementRegionale');
const EtablissementNationale = require('./EtablissementNationale');
const Branche = require('./Branche');
const Specialite = require('./Specialite');
const Module = require('./Module');
const Cours = require('./Cours');
const Memoire = require('./Memoire');
const Programme = require('./Programme');
const Grade = require('./Grade');
const Ens_Module = require('./Ens_Module');
const Offre = require('./Offre');
const SpecialiteEtab = require('./SpecialiteEtab');
const Diplome = require('./Diplome');
const Mode_Formation = require('./Mode_Formation');
const Inscription = require('./Inscription');

function setupAssociations() {
  const cascadeOptions = { onDelete: 'CASCADE', onUpdate: 'CASCADE' };

  // =================
  // Compte relations (with aliases to fix EagerLoadingError)
  // =================
  Enseignant.belongsTo(Compte, { foreignKey: 'compte_id', as: 'Compte', ...cascadeOptions });
  Compte.hasOne(Enseignant, { foreignKey: 'compte_id', as: 'enseignant', ...cascadeOptions });

  Stagiaire.belongsTo(Compte, { foreignKey: 'compte_id', as: 'Compte', ...cascadeOptions });
  Compte.hasOne(Stagiaire, { foreignKey: 'compte_id', as: 'stagiaire', ...cascadeOptions });

  EtablissementFormation.belongsTo(Compte, { foreignKey: 'compte_id', as: 'Compte', ...cascadeOptions });
  Compte.hasOne(EtablissementFormation, { foreignKey: 'compte_id', as: 'etablissementFormation', ...cascadeOptions });

  EtablissementRegionale.belongsTo(Compte, { foreignKey: 'compte_id', as: 'Compte', ...cascadeOptions });
  Compte.hasOne(EtablissementRegionale, { foreignKey: 'compte_id', as: 'etablissementRegionale', ...cascadeOptions });

  EtablissementNationale.belongsTo(Compte, { foreignKey: 'compte_id', as: 'Compte', ...cascadeOptions });
  Compte.hasOne(EtablissementNationale, { foreignKey: 'compte_id', as: 'etablissementNationale', ...cascadeOptions });

  // =========================
  // Associations principales
  // =========================

  // Branche -> EtablissementRegionale
  Branche.belongsTo(EtablissementRegionale, { foreignKey: 'id_etab_regionale', as: 'etablissementRegionale', ...cascadeOptions });
  EtablissementRegionale.hasMany(Branche, { foreignKey: 'id_etab_regionale', as: 'branches', ...cascadeOptions });

  // Specialite -> Branche
  Specialite.belongsTo(Branche, { foreignKey: 'id_branche', as: 'branche', ...cascadeOptions });
  Branche.hasMany(Specialite, { foreignKey: 'id_branche', as: 'specialites', ...cascadeOptions });

  // Module -> Specialite
  Module.belongsTo(Specialite, { foreignKey: 'id_specialite', as: 'specialite', ...cascadeOptions });
  Specialite.hasMany(Module, { foreignKey: 'id_specialite', as: 'modules', ...cascadeOptions });

  // Enseignant -> Grade
  Enseignant.belongsTo(Grade, { foreignKey: 'id_grade', as: 'grade', ...cascadeOptions });
  Grade.hasMany(Enseignant, { foreignKey: 'id_grade', as: 'enseignants', ...cascadeOptions });

  // Enseignant -> EtablissementFormation
  Enseignant.belongsTo(EtablissementFormation, { foreignKey: 'id_etab_formation', as: 'etablissementFormation', ...cascadeOptions });
  EtablissementFormation.hasMany(Enseignant, { foreignKey: 'id_etab_formation', as: 'enseignants', ...cascadeOptions });

  // Many-to-Many Enseignant <-> Module
  Enseignant.belongsToMany(Module, { through: Ens_Module, foreignKey: 'id_enseignant', otherKey: 'id_module', as: 'modules', ...cascadeOptions });
  Module.belongsToMany(Enseignant, { through: Ens_Module, foreignKey: 'id_module', otherKey: 'id_enseignant', as: 'enseignants', ...cascadeOptions });

  // Direct associations for Ens_Module
  Ens_Module.belongsTo(Module, { foreignKey: 'id_module', as: 'module', ...cascadeOptions });
  Ens_Module.belongsTo(Enseignant, { foreignKey: 'id_enseignant', as: 'enseignant', ...cascadeOptions });
  Module.hasMany(Ens_Module, { foreignKey: 'id_module', as: 'ensModules', ...cascadeOptions });
  Enseignant.hasMany(Ens_Module, { foreignKey: 'id_enseignant', as: 'ensModules', ...cascadeOptions });

  // =========================
  // Offre (Many-to-Many complexe)
  // =========================

  Offre.belongsTo(Specialite, { foreignKey: 'id_specialite', as: 'specialite', ...cascadeOptions });
  Specialite.hasMany(Offre, { foreignKey: 'id_specialite', as: 'offres', ...cascadeOptions });

  Offre.belongsTo(EtablissementFormation, { foreignKey: 'id_etab_formation', as: 'etablissementFormation', ...cascadeOptions });
  EtablissementFormation.hasMany(Offre, { foreignKey: 'id_etab_formation', as: 'offres', ...cascadeOptions });

  // Diplome associations
  Offre.belongsTo(Diplome, { foreignKey: 'id_diplome', as: 'diplome', ...cascadeOptions });
  Diplome.hasMany(Offre, { foreignKey: 'id_diplome', as: 'offres', ...cascadeOptions });

  Offre.belongsTo(Mode_Formation, { foreignKey: 'id_mode', as: 'modeFormation', ...cascadeOptions });
  Mode_Formation.hasMany(Offre, { foreignKey: 'id_mode', as: 'offres', ...cascadeOptions });

  // =========================
  // Inscription relations (Stagiaire <-> Offre)
  // =========================
  Stagiaire.belongsToMany(Offre, { through: Inscription, foreignKey: 'id_stagiaire', otherKey: 'id_offre', as: 'offres', ...cascadeOptions });
  Offre.belongsToMany(Stagiaire, { through: Inscription, foreignKey: 'id_offre', otherKey: 'id_stagiaire', as: 'stagiaires', ...cascadeOptions });

  // Direct associations for Inscription
  Inscription.belongsTo(Stagiaire, { foreignKey: 'id_stagiaire', as: 'stagiaire', ...cascadeOptions });
  Stagiaire.hasMany(Inscription, { foreignKey: 'id_stagiaire', as: 'inscriptions', ...cascadeOptions });

  Inscription.belongsTo(Offre, { foreignKey: 'id_offre', as: 'offre', ...cascadeOptions });
  Offre.hasMany(Inscription, { foreignKey: 'id_offre', as: 'inscriptions', ...cascadeOptions });

  // =========================
  // Specialite <-> EtablissementFormation
  // =========================
  Specialite.belongsToMany(EtablissementFormation, { through: SpecialiteEtab, foreignKey: 'id_specialite', otherKey: 'id_etab_formation', as: 'etablissementsFormation', ...cascadeOptions });
  EtablissementFormation.belongsToMany(Specialite, { through: SpecialiteEtab, foreignKey: 'id_etab_formation', otherKey: 'id_specialite', as: 'specialites', ...cascadeOptions });

  // =========================
  // Cours relations
  // =========================
  Cours.belongsTo(Module, { foreignKey: 'id_module', as: 'module', ...cascadeOptions });
  Module.hasMany(Cours, { foreignKey: 'id_module', as: 'cours', ...cascadeOptions });

  Cours.belongsTo(Enseignant, { foreignKey: 'id_enseignant', as: 'enseignant', ...cascadeOptions });
  Enseignant.hasMany(Cours, { foreignKey: 'id_enseignant', as: 'cours', ...cascadeOptions });

  // =========================
  // Memoire relations
  // =========================
  Memoire.belongsTo(Stagiaire, { foreignKey: 'id_stagiaire', as: 'stagiaire', ...cascadeOptions });
  Stagiaire.hasMany(Memoire, { foreignKey: 'id_stagiaire', as: 'memoires', ...cascadeOptions });

  Memoire.belongsTo(Enseignant, { foreignKey: 'id_enseignant', as: 'enseignant', ...cascadeOptions });
  Enseignant.hasMany(Memoire, { foreignKey: 'id_enseignant', as: 'memoiresEncadres', ...cascadeOptions });

  // =========================
  // Programme relations
  // =========================
  Programme.belongsTo(EtablissementRegionale, { foreignKey: 'id_etab_regionale', as: 'etablissementregionale', ...cascadeOptions });
  EtablissementRegionale.hasMany(Programme, { foreignKey: 'id_etab_regionale', as: 'programmes', ...cascadeOptions });

  Programme.belongsTo(Module, { foreignKey: 'id_module', as: 'module', ...cascadeOptions });
  Module.hasMany(Programme, { foreignKey: 'id_module', as: 'programmes', ...cascadeOptions });
}

module.exports = setupAssociations;
