const express = require('express');
const router = express.Router();

const ProgrammeController = require('../controllers/ProgrammeController');
const { isAuth, isEnseignant } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Programmes
 *   description: Gestion des programmes
 */

/**
 * @swagger
 * /programme:
 *   get:
 *     summary: Récupérer tous les programmes
 *     tags: [Programmes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des programmes
 *       401:
 *         description: Non authentifié
 */
router.get('/', isAuth, ProgrammeController.getAllProgrammes);

/**
 * @swagger
 * /programme/enseignant/{id_enseignant}:
 *   get:
 *     summary: Récupérer les programmes pour les modules enseignés par un enseignant
 *     tags: [Programmes]
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
 *         description: Programmes de l'enseignant
 *       401:
 *         description: Non authentifié
 */
router.get('/enseignant/:id_enseignant', isAuth, isEnseignant, ProgrammeController.getProgrammesByEnseignant);

/**
 * @swagger
 * /programme/{id_programme}:
 *   get:
 *     summary: Récupérer un programme par ID
 *     tags: [Programmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_programme
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Programme trouvé
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Programme introuvable
 */
router.get('/:id_programme', isAuth, ProgrammeController.getProgrammeById);

module.exports = router;