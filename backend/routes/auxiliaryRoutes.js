const express = require('express');
const router = express.Router();

const AuxiliaryController = require('../controllers/AuxiliaryController');
const { isAuth } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Auxiliary
 *   description: Données auxiliaires (grades, spécialités, diplômes, modes de formation)
 */

/**
 * @swagger
 * /grades:
 *   get:
 *     summary: Récupérer tous les grades
 *     tags: [Auxiliary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des grades
 *       500:
 *         description: Erreur serveur
 */
router.get('/grades', isAuth, AuxiliaryController.getAllGrades);

/**
 * @swagger
 * /specialites:
 *   get:
 *     summary: Récupérer toutes les spécialités
 *     tags: [Auxiliary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des spécialités
 *       500:
 *         description: Erreur serveur
 */
router.get('/specialites', isAuth, AuxiliaryController.getAllSpecialites);

/**
 * @swagger
 * /diplomes:
 *   get:
 *     summary: Récupérer tous les diplômes
 *     tags: [Auxiliary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des diplômes
 *       500:
 *         description: Erreur serveur
 */
router.get('/diplomes', isAuth, AuxiliaryController.getAllDiplomes);

/**
 * @swagger
 * /mode-formations:
 *   get:
 *     summary: Récupérer tous les modes de formation
 *     tags: [Auxiliary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des modes de formation
 *       500:
 *         description: Erreur serveur
 */
router.get('/mode-formations', isAuth, AuxiliaryController.getAllModeFormations);

module.exports = router;