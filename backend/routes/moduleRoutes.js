const express = require('express');
const router = express.Router();

const ModuleController = require('../controllers/ModuleController');
const { isAuth, isEnseignant } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: Gestion des modules
 */

/**
 * @swagger
 * /module:
 *   get:
 *     summary: Récupérer tous les modules
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des modules
 *       401:
 *         description: Non authentifié
 */
router.get('/', isAuth, ModuleController.getAllModules);

/**
 * @swagger
 * /module/enseignant/{id_enseignant}:
 *   get:
 *     summary: Récupérer les modules enseignés par un enseignant
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_enseignant
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Modules de l'enseignant
 *       401:
 *         description: Non authentifié
 */
router.get('/enseignant/:id_enseignant', isAuth, isEnseignant, ModuleController.getModulesByEnseignant);

// Récupérer le nombre de modules
router.get('/count', isAuth, ModuleController.getModulesCount);

// Récupérer les modules par spécialité
router.get('/specialite/:id_specialite', isAuth, async (req, res) => {
  try {
    const { id_specialite } = req.params;
    const Module = require('../models/Module');
    
    const modules = await Module.findAll({
      where: { id_specialite: parseInt(id_specialite) },
      attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module', 'id_specialite'],
      order: [['designation_fr', 'ASC']]
    });

    return res.json({
      data: modules,
      total: modules.length
    });
  } catch (error) {
    console.error('Error fetching modules by specialite:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

/**
 * @swagger
 * /module/{id_module}:
 *   get:
 *     summary: Récupérer un module par ID
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_module
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails du module
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Module introuvable
 */
router.get('/:id_module', isAuth, ModuleController.getModuleById);

module.exports = router;

