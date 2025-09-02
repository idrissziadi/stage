const express = require('express');
const router = express.Router();

const EnsModuleController = require('../controllers/EnsModuleController');
const { isAuth } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: EnsModule
 *   description: Gestion des assignations module-enseignant
 */

/**
 * @swagger
 * /ens-module/enseignant/{id_enseignant}/modules-disponibles:
 *   get:
 *     summary: Récupérer les modules disponibles pour un enseignant
 *     description: Récupère les modules des spécialités des offres de l'établissement de l'enseignant
 *     tags: [EnsModule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_enseignant
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'enseignant
 *     responses:
 *       200:
 *         description: Modules disponibles récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 enseignant:
 *                   type: object
 *                   properties:
 *                     id_enseignant:
 *                       type: integer
 *                     nom_fr:
 *                       type: string
 *                     prenom_fr:
 *                       type: string
 *                     etablissement:
 *                       type: object
 *                 offres:
 *                   type: integer
 *                 specialites:
 *                   type: integer
 *                 modules:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Enseignant non trouvé
 *       400:
 *         description: Enseignant non assigné à un établissement
 *       500:
 *         description: Erreur serveur
 */
router.get('/enseignant/:id_enseignant/modules-disponibles', isAuth, EnsModuleController.getAvailableModulesForEnseignant);

/**
 * @swagger
 * /ens-module/enseignant/{id_enseignant}/assigner:
 *   post:
 *     summary: Assigner des modules à un enseignant
 *     description: Assigne des modules à un enseignant (seulement ceux des spécialités des offres de son établissement)
 *     tags: [EnsModule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_enseignant
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'enseignant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modules
 *               - annee_scolaire
 *             properties:
 *               modules:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Liste des IDs des modules à assigner
 *               annee_scolaire:
 *                 type: string
 *                 format: date
 *                 description: Année scolaire (format YYYY-MM-DD)
 *               semestre:
 *                 type: string
 *                 enum: [S1, S2, S3, S4, Premier, Deuxième]
 *                 description: Semestre (optionnel)
 *     responses:
 *       201:
 *         description: Modules assignés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 enseignant:
 *                   type: object
 *                 annee_scolaire:
 *                   type: string
 *                 semestre:
 *                   type: string
 *                 modules_assigned:
 *                   type: array
 *                 total_modules:
 *                   type: integer
 *       400:
 *         description: Données invalides ou modules non autorisés
 *       404:
 *         description: Enseignant non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post('/enseignant/:id_enseignant/assigner', isAuth, EnsModuleController.assignModulesToEnseignant);

/**
 * @swagger
 * /ens-module/enseignant/{id_enseignant}/modules:
 *   get:
 *     summary: Récupérer les modules assignés à un enseignant
 *     description: Récupère tous les modules assignés à un enseignant, groupés par année scolaire
 *     tags: [EnsModule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_enseignant
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'enseignant
 *       - in: query
 *         name: annee_scolaire
 *         schema:
 *           type: string
 *           format: date
 *         description: Année scolaire spécifique (optionnel)
 *     responses:
 *       200:
 *         description: Modules de l'enseignant récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 enseignant_id:
 *                   type: integer
 *                 modules_by_year:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: object
 *                 total_modules:
 *                   type: integer
 *       500:
 *         description: Erreur serveur
 */
router.get('/enseignant/:id_enseignant/modules', isAuth, EnsModuleController.getModulesByEnseignant);

/**
 * @swagger
 * /ens-module/enseignant/{id_enseignant}/module/{id_module}/{annee_scolaire}:
 *   delete:
 *     summary: Retirer un module d'un enseignant
 *     description: Supprime l'assignation d'un module spécifique à un enseignant pour une année scolaire donnée
 *     tags: [EnsModule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_enseignant
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'enseignant
 *       - in: path
 *         name: id_module
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du module
 *       - in: path
 *         name: annee_scolaire
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Année scolaire (format YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Module retiré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 enseignant_id:
 *                   type: integer
 *                 module_id:
 *                   type: integer
 *                 annee_scolaire:
 *                   type: string
 *       404:
 *         description: Assignation non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/enseignant/:id_enseignant/module/:id_module/:annee_scolaire', isAuth, EnsModuleController.removeModuleFromEnseignant);

module.exports = router;
