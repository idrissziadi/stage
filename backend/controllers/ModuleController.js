const Module = require('../models/Module');
const EnsModule = require('../models/Ens_Module');
const { Op } = require('sequelize');

const ModuleController = {
  // Récupérer tous les modules
  async getAllModules(req, res) {
    try {
      const modules = await Module.findAll({
        order: [['designation_fr', 'ASC']]
      });
      return res.json(modules);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer les modules enseignés par un enseignant
  async getModulesByEnseignant(req, res) {
    try {
      const { id_enseignant } = req.params;
      
      console.log('Getting modules for enseignant ID:', id_enseignant);
      
      // Récupérer les modules enseignés par cet enseignant
      const ensModules = await EnsModule.findAll({
        where: { id_enseignant },
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module']
          }
        ]
      });

      console.log('Found ensModules:', ensModules.length);

      // Extraire les modules
      const modules = ensModules.map(em => em.module);
      
      console.log('Extracted modules:', modules.length);
      
      return res.json(modules);
    } catch (error) {
      console.error('Error in getModulesByEnseignant:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer un module par ID
  async getModuleById(req, res) {
    try {
      const { id_module } = req.params;
      
      const module = await Module.findByPk(id_module);
      if (!module) {
        return res.status(404).json({ message: 'Module introuvable' });
      }

      return res.json(module);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = ModuleController;

