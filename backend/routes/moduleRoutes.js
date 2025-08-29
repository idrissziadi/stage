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

