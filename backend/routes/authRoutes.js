const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const { isAuth, isEtablissementFormation } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints d'authentification
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion avec username et password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Succès, retourne le rôle et le token JWT
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnexion et mise en liste noire du token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       400:
 *         description: Token manquant ou invalide
 *       401:
 *         description: Non authentifié
 */
router.post('/logout', isAuth, AuthController.logout);

/**
 * @swagger
 * /auth/register/stagiaire:
 *   post:
 *     summary: Créer un compte Stagiaire (réservé aux établissements de formation)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Stagiaire créé
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       409:
 *         description: Nom d'utilisateur déjà pris
 */
router.post('/register/stagiaire', isAuth, isEtablissementFormation, AuthController.registerStagiaire);

/**
 * @swagger
 * /auth/register/enseignant:
 *   post:
 *     summary: Créer un compte Enseignant (réservé aux établissements de formation)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Enseignant créé
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       409:
 *         description: Nom d'utilisateur déjà pris
 */
router.post('/register/enseignant', isAuth, isEtablissementFormation, AuthController.registerEnseignant);

/**
 * @swagger
 * /auth/password:
 *   post:
 *     summary: Changer le mot de passe de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, oldPassword, newPassword]
 *             properties:
 *               userId:
 *                 type: integer
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe changé
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non authentifié ou ancien mot de passe incorrect
 *       404:
 *         description: Compte introuvable
 */
router.post('/password', isAuth, AuthController.changerMotDePasse);

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Créer un compte avec un rôle donné
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, role]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Stagiaire, Enseignant, EtablissementFormation, EtablissementRegionale, EtablissementNationale]
 *     responses:
 *       201:
 *         description: Compte créé
 *       400:
 *         description: Requête invalide
 *       409:
 *         description: Nom d'utilisateur déjà pris
 */
router.post('/signup', AuthController.signup);

/**
 * @swagger
 * /auth/signup/etablissement-formation:
 *   post:
 *     summary: Créer un établissement de formation avec stagiaire et inscription automatiques
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, nom_fr, nom_ar]
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur pour l'établissement
 *               password:
 *                 type: string
 *                 description: Mot de passe pour l'établissement
 *               nom_fr:
 *                 type: string
 *                 description: Nom de l'établissement en français
 *               nom_ar:
 *                 type: string
 *                 description: Nom de l'établissement en arabe
 *               adresse_fr:
 *                 type: string
 *                 description: Adresse de l'établissement en français
 *               adresse_ar:
 *                 type: string
 *                 description: Adresse de l'établissement en arabe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email de l'établissement
 *               telephone:
 *                 type: string
 *                 description: Téléphone de l'établissement
 *               stagiaire_nom_fr:
 *                 type: string
 *                 description: Nom du stagiaire en français
 *               stagiaire_nom_ar:
 *                 type: string
 *                 description: Nom du stagiaire en arabe
 *               stagiaire_prenom_fr:
 *                 type: string
 *                 description: Prénom du stagiaire en français
 *               stagiaire_prenom_ar:
 *                 type: string
 *                 description: Prénom du stagiaire en arabe
 *               stagiaire_date_naissance:
 *                 type: string
 *                 format: date
 *                 description: Date de naissance du stagiaire
 *               stagiaire_email:
 *                 type: string
 *                 format: email
 *                 description: Email du stagiaire
 *               stagiaire_telephone:
 *                 type: string
 *                 description: Téléphone du stagiaire
 *               id_specialite:
 *                 type: integer
 *                 description: ID de la spécialité pour l'offre (optionnel)
 *               id_diplome:
 *                 type: integer
 *                 description: ID du diplôme pour l'offre (optionnel)
 *               id_mode:
 *                 type: integer
 *                 description: ID du mode de formation pour l'offre (optionnel)
 *     responses:
 *       201:
 *         description: Établissement de formation créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 etablissement:
 *                   type: object
 *                   properties:
 *                     id_etab_formation:
 *                       type: integer
 *                     code:
 *                       type: string
 *                     nom_fr:
 *                       type: string
 *                     nom_ar:
 *                       type: string
 *                 stagiaire:
 *                   type: object
 *                   properties:
 *                     id_stagiaire:
 *                       type: integer
 *                     nom_fr:
 *                       type: string
 *                     prenom_fr:
 *                       type: string
 *                 offre:
 *                   type: object
 *                   properties:
 *                     id_offre:
 *                       type: integer
 *                     designation:
 *                       type: string
 *                 inscription:
 *                   type: object
 *                   properties:
 *                     id_inscription:
 *                       type: integer
 *                     statut:
 *                       type: string
 *       400:
 *         description: Requête invalide
 *       409:
 *         description: Nom d'utilisateur ou email déjà pris
 *       500:
 *         description: Erreur serveur
 */
router.post('/signup/etablissement-formation', AuthController.signupEtablissementFormation);

/**
 * @swagger
 * /auth/password-reset/initiate:
 *   post:
 *     summary: Initier la réinitialisation de mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Lien de réinitialisation envoyé
 *       400:
 *         description: Email requis
 */
router.post('/password-reset/initiate', AuthController.initiatePasswordReset);

/**
 * @swagger
 * /auth/password-reset/confirm:
 *   post:
 *     summary: Confirmer la réinitialisation de mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [resetToken, newPassword, accountId]
 *             properties:
 *               resetToken:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               accountId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 *       400:
 *         description: Token invalide ou expiré
 *       404:
 *         description: Compte introuvable
 */
router.post('/password-reset/confirm', AuthController.resetPassword);

/**
 * @swagger
 * /auth/validate-session:
 *   get:
 *     summary: Valider la session courante
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Session valide
 *       401:
 *         description: Session invalide
 */
router.get('/validate-session', isAuth, AuthController.validateSession);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Rafraîchir le token d'authentification
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token rafraìhi avec succès
 *       401:
 *         description: Non authentifié
 */
router.post('/refresh-token', isAuth, AuthController.refreshToken);

module.exports = router;


