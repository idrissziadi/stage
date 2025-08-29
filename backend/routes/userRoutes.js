const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');
const { isAuth } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Gestion des profils utilisateurs
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *       401:
 *         description: Non authentifié
 */
router.get('/profile', isAuth, UserController.getProfile);

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Mettre à jour le profil de l'utilisateur connecté
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       401:
 *         description: Non authentifié
 */
router.put('/profile', isAuth, UserController.updateProfile);

module.exports = router;

