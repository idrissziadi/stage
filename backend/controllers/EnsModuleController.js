const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const Ens_Module = require('../models/Ens_Module');
const Enseignant = require('../models/Enseignant');
const Module = require('../models/Module');
const Offre = require('../models/Offre');
const Specialite = require('../models/Specialite');
const EtablissementFormation = require('../models/EtablissementFormation');

const EnsModuleController = {
  // Récupérer tous les modules disponibles pour un enseignant
  // (modules des spécialités des offres de son établissement)
  async getAvailableModulesForEnseignant(req, res) {
    try {
      const { id_enseignant } = req.params;
      
      // Vérifier que l'enseignant existe et récupérer son établissement
      const enseignant = await Enseignant.findByPk(id_enseignant, {
        include: [{
          model: EtablissementFormation,
          as: 'etablissementFormation',
          attributes: ['id_etab_formation', 'nom_fr', 'nom_ar']
        }]
      });

      if (!enseignant) {
        return res.status(404).json({
          message: 'Enseignant non trouvé'
        });
      }

      if (!enseignant.id_etab_formation) {
        return res.status(400).json({
          message: 'Cet enseignant n\'est pas assigné à un établissement de formation'
        });
      }

      // Récupérer toutes les offres de l'établissement avec leurs spécialités
      const offres = await Offre.findAll({
        where: { 
          id_etab_formation: enseignant.id_etab_formation,
          statut: { [Op.in]: ['active', 'brouillon'] } // Offres actives ou en brouillon
        },
        include: [{
          model: Specialite,
          as: 'specialite',
          attributes: ['id_specialite', 'designation_fr', 'designation_ar']
        }]
      });

      if (offres.length === 0) {
        return res.json({
          message: 'Aucune offre trouvée pour cet établissement',
          modules: []
        });
      }

      // Extraire les IDs des spécialités des offres
      const specialiteIds = [...new Set(offres.map(offre => offre.id_specialite))];

      // Récupérer tous les modules de ces spécialités
      const modules = await Module.findAll({
        where: { id_specialite: { [Op.in]: specialiteIds } },
        attributes: ['id_module', 'code_module', 'designation_fr', 'designation_ar', 'id_specialite'],
        include: [{
          model: Specialite,
          as: 'specialite',
          attributes: ['id_specialite', 'designation_fr', 'designation_ar']
        }],
        order: [['designation_fr', 'ASC']]
      });

      return res.json({
        message: 'Modules disponibles récupérés avec succès',
        enseignant: {
          id_enseignant: enseignant.id_enseignant,
          nom_fr: enseignant.nom_fr,
          prenom_fr: enseignant.prenom_fr,
          etablissement: enseignant.etablissementFormation
        },
        offres: offres.length,
        specialites: specialiteIds.length,
        modules: modules
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des modules disponibles:', error);
      return res.status(500).json({
        message: 'Erreur serveur lors de la récupération des modules disponibles',
        error: error.message
      });
    }
  },

  // Assigner des modules à un enseignant
  async assignModulesToEnseignant(req, res) {
    try {
      const { id_enseignant } = req.params;
      const { modules, annee_scolaire, semestre } = req.body;

      if (!modules || !Array.isArray(modules) || modules.length === 0) {
        return res.status(400).json({
          message: 'La liste des modules est requise et doit être un tableau non vide'
        });
      }

      if (!annee_scolaire) {
        return res.status(400).json({
          message: 'L\'année scolaire est requise'
        });
      }

      // Vérifier que l'enseignant existe et récupérer son établissement
      const enseignant = await Enseignant.findByPk(id_enseignant, {
        include: [{
          model: EtablissementFormation,
          as: 'etablissementFormation',
          attributes: ['id_etab_formation', 'nom_fr']
        }]
      });

      if (!enseignant) {
        return res.status(404).json({
          message: 'Enseignant non trouvé'
        });
      }

      if (!enseignant.id_etab_formation) {
        return res.status(400).json({
          message: 'Cet enseignant n\'est pas assigné à un établissement de formation'
        });
      }

      // Vérifier que tous les modules existent et appartiennent aux spécialités des offres de l'établissement
      const offres = await Offre.findAll({
        where: { 
          id_etab_formation: enseignant.id_etab_formation,
          statut: { [Op.in]: ['active', 'brouillon'] }
        },
        attributes: ['id_specialite']
      });

      const specialiteIds = [...new Set(offres.map(offre => offre.id_specialite))];

      // Vérifier que tous les modules demandés existent et sont dans les bonnes spécialités
      const modulesToAssign = await Module.findAll({
        where: { 
          id_module: { [Op.in]: modules },
          id_specialite: { [Op.in]: specialiteIds }
        },
        attributes: ['id_module', 'code_module', 'designation_fr', 'id_specialite']
      });

      if (modulesToAssign.length !== modules.length) {
        const foundModuleIds = modulesToAssign.map(m => m.id_module);
        const missingModules = modules.filter(id => !foundModuleIds.includes(id));
        
        return res.status(400).json({
          message: 'Certains modules ne peuvent pas être assignés',
          details: `Modules non autorisés: ${missingModules.join(', ')}. Seuls les modules des spécialités des offres de votre établissement peuvent être assignés.`
        });
      }

      // Supprimer les anciennes assignations pour cet enseignant et cette année scolaire
      await Ens_Module.destroy({
        where: { 
          id_enseignant,
          annee_scolaire
        }
      });

      // Créer les nouvelles assignations
      const assignations = modules.map(id_module => ({
        id_module,
        id_enseignant,
        annee_scolaire,
        semestre: semestre || null
      }));

      const createdAssignations = await Ens_Module.bulkCreate(assignations);

      return res.status(201).json({
        message: `${createdAssignations.length} module(s) assigné(s) avec succès à l'enseignant`,
        enseignant: {
          id_enseignant: enseignant.id_enseignant,
          nom_fr: enseignant.nom_fr,
          prenom_fr: enseignant.prenom_fr,
          etablissement: enseignant.etablissementFormation.nom_fr
        },
        annee_scolaire,
        semestre,
        modules_assigned: modulesToAssign.map(m => ({
          id_module: m.id_module,
          code_module: m.code_module,
          designation_fr: m.designation_fr
        })),
        total_modules: createdAssignations.length
      });

    } catch (error) {
      console.error('Erreur lors de l\'assignation des modules:', error);
      return res.status(500).json({
        message: 'Erreur serveur lors de l\'assignation des modules',
        error: error.message
      });
    }
  },

  // Récupérer les modules assignés à un enseignant
  async getModulesByEnseignant(req, res) {
    try {
      const { id_enseignant } = req.params;
      const { annee_scolaire } = req.query;

      console.log('🔍 getModulesByEnseignant called with:', { id_enseignant, annee_scolaire });

      let whereClause = { id_enseignant };
      if (annee_scolaire) {
        whereClause.annee_scolaire = annee_scolaire;
      }

      console.log('🔍 Where clause:', whereClause);

      const ensModules = await Ens_Module.findAll({
        where: whereClause,
        include: [{
          model: Module,
          as: 'module',
          attributes: ['id_module', 'code_module', 'designation_fr', 'designation_ar'],
          include: [{
            model: Specialite,
            as: 'specialite',
            attributes: ['id_specialite', 'designation_fr', 'designation_ar']
          }]
        }],
        order: [['annee_scolaire', 'DESC'], ['semestre', 'ASC']]
      });

      console.log('🔍 Found ensModules:', ensModules.length);
      console.log('🔍 ensModules data:', JSON.stringify(ensModules, null, 2));

      // Extraire les modules dans un format simple que le frontend peut utiliser
      const modules = ensModules.map(ensModule => ({
        id_module: ensModule.module.id_module,
        code_module: ensModule.module.code_module,
        designation_fr: ensModule.module.designation_fr,
        designation_ar: ensModule.module.designation_ar,
        specialite: ensModule.module.specialite,
        semestre: ensModule.semestre,
        annee_scolaire: ensModule.annee_scolaire,
        assigned_at: ensModule.createdAt
      }));

      console.log('🔍 Extracted modules:', modules.length);
      console.log('🔍 modules data:', JSON.stringify(modules, null, 2));

      // Retourner le format attendu par le frontend
      const response = { data: modules };
      console.log('🔍 Final response:', JSON.stringify(response, null, 2));
      
      return res.json(response);

    } catch (error) {
      console.error('❌ Error in getModulesByEnseignant:', error);
      return res.status(500).json({
        message: 'Erreur serveur lors de la récupération des modules de l\'enseignant',
        error: error.message
      });
    }
  },

  // Supprimer l'assignation d'un module à un enseignant
  async removeModuleFromEnseignant(req, res) {
    try {
      const { id_enseignant, id_module, annee_scolaire } = req.params;

      const deleted = await Ens_Module.destroy({
        where: {
          id_enseignant: parseInt(id_enseignant),
          id_module: parseInt(id_module),
          annee_scolaire
        }
      });

      if (deleted === 0) {
        return res.status(404).json({
          message: 'Assignation module-enseignant non trouvée'
        });
      }

      return res.json({
        message: 'Module retiré de l\'enseignant avec succès',
        enseignant_id: id_enseignant,
        module_id: id_module,
        annee_scolaire
      });

    } catch (error) {
      console.error('Erreur lors de la suppression de l\'assignation:', error);
      return res.status(500).json({
        message: 'Erreur serveur lors de la suppression de l\'assignation',
        error: error.message
      });
    }
  }
};

module.exports = EnsModuleController;
