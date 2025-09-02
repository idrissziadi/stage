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
      
      console.log('🔍 Getting modules for enseignant ID:', id_enseignant);
      
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

      console.log('📊 Found ensModules:', ensModules.length);
      console.log('📊 ensModules data:', JSON.stringify(ensModules, null, 2));

      // Extraire les modules et filtrer les valeurs null
      const modules = ensModules
        .map(em => em.module)
        .filter(module => module !== null && module !== undefined);
      
      console.log('🎯 Extracted modules:', modules.length);
      console.log('🎯 modules data:', JSON.stringify(modules, null, 2));
      
      // Ensure we always return an array, even if empty
      const response = { data: Array.isArray(modules) ? modules : [] };
      console.log('📤 Final response:', JSON.stringify(response, null, 2));
      
      return res.json(response);
    } catch (error) {
      console.error('❌ Error in getModulesByEnseignant:', error);
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
  },

  // Get modules count
  async getModulesCount(req, res) {
    try {
      const count = await Module.count();
      return res.json({ count });
    } catch (error) {
      console.error('Error counting modules:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors du comptage des modules', 
        error: error.message 
      });
    }
  }
};

module.exports = ModuleController;

