const Programme = require('../models/Programme');
const Module = require('../models/Module');
const EtablissementRegionale = require('../models/EtablissementRegionale');
const EnsModule = require('../models/Ens_Module');
const { Op } = require('sequelize');

const ProgrammeController = {
  // Récupérer tous les programmes
  async getAllProgrammes(req, res) {
    try {
      const programmes = await Programme.findAll({
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['designation_fr', 'designation_ar', 'code_module']
          },
          {
            model: EtablissementRegionale,
            as: 'etablissementregionale',
            attributes: ['nom_fr', 'nom_ar']
          }
        ],
        order: [['id_programme', 'DESC']]
      });
      return res.json(programmes);
    } catch (error) {
      console.error('Error in getAllProgrammes:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer les programmes pour les modules enseignés par un enseignant
  async getProgrammesByEnseignant(req, res) {
    try {
      const { id_enseignant } = req.params;
      
      // Récupérer les modules enseignés par cet enseignant
      const modulesEnseignes = await EnsModule.findAll({
        where: { id_enseignant },
        attributes: ['id_module']
      });

      const moduleIds = modulesEnseignes.map(em => em.id_module);

      if (moduleIds.length === 0) {
        return res.json([]);
      }

      // Récupérer les programmes pour ces modules
      const programmes = await Programme.findAll({
        where: { 
          id_module: { [Op.in]: moduleIds }
        },
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['designation_fr', 'designation_ar', 'code_module']
          },
          {
            model: EtablissementRegionale,
            as: 'etablissementregionale',
            attributes: ['nom_fr', 'nom_ar']
          }
        ],
        order: [['id_programme', 'DESC']]
      });

      return res.json(programmes);
    } catch (error) {
      console.error('Error in getProgrammesByEnseignant:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer un programme par ID
  async getProgrammeById(req, res) {
    try {
      const { id_programme } = req.params;
      
      const programme = await Programme.findByPk(id_programme, {
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['designation_fr', 'designation_ar', 'code_module']
          },
          {
            model: EtablissementRegionale,
            as: 'etablissementregionale',
            attributes: ['nom_fr', 'nom_ar']
          }
        ]
      });

      if (!programme) {
        return res.status(404).json({ message: 'Programme introuvable' });
      }

      return res.json(programme);
    } catch (error) {
      console.error('Error in getProgrammeById:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = ProgrammeController;