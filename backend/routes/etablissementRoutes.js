const express = require('express');
const router = express.Router();

const EtablissementController = require('../controllers/EtablissementController');
const { isAuth } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Etablissement
 *   description: Gestion des établissements de formation
 */

/**
 * @swagger
 * /etablissement/{id_etab_formation}/stats:
 *   get:
 *     summary: Récupérer les statistiques de l'établissement
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques de l'établissement
 *       403:
 *         description: Accès refusé
 */
router.get('/stats', isAuth, EtablissementController.getEtablissementStats);

/**
 * @swagger
 * /etablissement/{id_etab_formation}/enseignants:
 *   get:
 *     summary: Récupérer tous les enseignants d'un établissement
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_etab_formation
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Liste des enseignants
 *       403:
 *         description: Accès refusé
 */
router.get('/:id_etab_formation/enseignants', isAuth, EtablissementController.getEnseignantsByEtablissement);

/**
 * @swagger
 * /etablissement-regional/{id_etab_regionale}/enseignants:
 *   get:
 *     summary: Récupérer tous les enseignants d'un établissement régional
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_etab_regionale
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Liste des enseignants
 *       403:
 *         description: Accès refusé
 */
router.get('/regional/:id_etab_regionale/enseignants', isAuth, EtablissementController.getEnseignantsByEtablissementRegional);

/**
 * @swagger
 * /etablissement/{id_etab_formation}/stagiaires:
 *   get:
 *     summary: Récupérer tous les stagiaires d'un établissement
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_etab_formation
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Liste des stagiaires
 *       403:
 *         description: Accès refusé
 */
router.get('/:id_etab_formation/stagiaires', isAuth, EtablissementController.getStagiairesByEtablissement);

/**
 * @swagger
 * /etablissement/enseignants:
 *   post:
 *     summary: Créer un nouvel enseignant
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - nom_fr
 *               - prenom_fr
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               nom_fr:
 *                 type: string
 *               prenom_fr:
 *                 type: string
 *               nom_ar:
 *                 type: string
 *               prenom_ar:
 *                 type: string
 *               email:
 *                 type: string
 *               telephone:
 *                 type: string
 *               date_naissance:
 *                 type: string
 *                 format: date
 *               id_grade:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Enseignant créé avec succès
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès refusé
 */
router.post('/enseignants', isAuth, EtablissementController.createEnseignant);

/**
 * @swagger
 * /etablissement/stagiaires:
 *   post:
 *     summary: Créer un nouveau stagiaire pour l'établissement
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nom_fr, prenom_fr]
 *             properties:
 *               nom_fr:
 *                 type: string
 *                 description: Nom du stagiaire en français
 *               prenom_fr:
 *                 type: string
 *                 description: Prénom du stagiaire en français
 *               nom_ar:
 *                 type: string
 *                 description: Nom du stagiaire en arabe
 *               prenom_ar:
 *                 type: string
 *                 description: Prénom du stagiaire en arabe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email du stagiaire
 *               telephone:
 *                 type: string
 *                 description: Téléphone du stagiaire
 *               date_naissance:
 *                 type: string
 *                 format: date
 *                 description: Date de naissance du stagiaire
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur pour créer un compte (optionnel)
 *               password:
 *                 type: string
 *                 description: Mot de passe pour créer un compte (optionnel)
 *               id_offre:
 *                 type: integer
 *                 description: ID de l'offre pour inscrire automatiquement le stagiaire (optionnel)
 *     responses:
 *       201:
 *         description: Stagiaire créé avec succès
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès refusé
 *       409:
 *         description: Conflit (email ou username déjà utilisé)
 */
router.post('/stagiaires', isAuth, EtablissementController.createStagiaire);

/**
 * @swagger
 * /etablissement/stagiaires/{id_stagiaire}/inscrire:
 *   post:
 *     summary: Inscrire un stagiaire existant à une offre de formation
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_stagiaire
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du stagiaire à inscrire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_offre]
 *             properties:
 *               id_offre:
 *                 type: integer
 *                 description: ID de l'offre de formation
 *     responses:
 *       201:
 *         description: Stagiaire inscrit avec succès
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Stagiaire ou offre introuvable
 *       409:
 *         description: Stagiaire déjà inscrit à cette offre
 */
router.post('/stagiaires/:id_stagiaire/inscrire', isAuth, EtablissementController.inscrireStagiaire);

/**
 * @swagger
 * /etablissement/stagiaires/inscription-masse:
 *   post:
 *     summary: Inscrire plusieurs stagiaires à une offre de formation en masse
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_offre, stagiaire_ids]
 *             properties:
 *               id_offre:
 *                 type: integer
 *                 description: ID de l'offre de formation
 *               stagiaire_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Liste des IDs des stagiaires à inscrire
 *     responses:
 *       201:
 *         description: Stagiaires inscrits avec succès
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Offre introuvable
 *       409:
 *         description: Tous les stagiaires sont déjà inscrits
 */
router.post('/stagiaires/inscription-masse', isAuth, EtablissementController.inscrireStagiairesEnMasse);

/**
 * @swagger
 * /etablissement/enseignants/{id_enseignant}:
 *   put:
 *     summary: Mettre à jour un enseignant
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_enseignant
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Enseignant mis à jour avec succès
 *       404:
 *         description: Enseignant introuvable
 *       403:
 *         description: Accès refusé
 */
router.put('/enseignants/:id_enseignant', isAuth, EtablissementController.updateEnseignant);

/**
 * @swagger
 * /etablissement/stagiaires/{id_stagiaire}:
 *   put:
 *     summary: Mettre à jour un stagiaire
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_stagiaire
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Stagiaire mis à jour avec succès
 *       404:
 *         description: Stagiaire introuvable
 *       403:
 *         description: Accès refusé
 */
router.put('/stagiaires/:id_stagiaire', isAuth, EtablissementController.updateStagiaire);

/**
 * @swagger
 * /etablissement/inscriptions:
 *   get:
 *     summary: Récupérer toutes les inscriptions de l'établissement
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, en_attente, acceptee, refusee, annulee]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Liste des inscriptions
 *       403:
 *         description: Accès refusé
 */
router.get('/inscriptions', isAuth, EtablissementController.getInscriptionsByEtablissement);

/**
 * @swagger
 * /etablissement/inscriptions/{id_inscription}/status:
 *   put:
 *     summary: Mettre à jour le statut d'une inscription
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_inscription
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - statut
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [en_attente, acceptee, refusee, annulee]
 *               observation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *       404:
 *         description: Inscription introuvable
 *       403:
 *         description: Accès refusé
 */
router.put('/inscriptions/:id_inscription/status', isAuth, EtablissementController.updateInscriptionStatus);

/**
 * @swagger
 * /etablissement/inscriptions/bulk-status:
 *   put:
 *     summary: Mettre à jour le statut de plusieurs inscriptions
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - inscription_ids
 *               - statut
 *             properties:
 *               inscription_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *               statut:
 *                 type: string
 *                 enum: [en_attente, acceptee, refusee, annulee]
 *               observation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Statuts mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès refusé
 */
router.put('/inscriptions/bulk-status', isAuth, EtablissementController.bulkUpdateInscriptionsStatus);

/**
 * @swagger
 * /etablissement/memoires:
 *   get:
 *     summary: Récupérer tous les mémoires de l'établissement
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Liste des mémoires
 *       403:
 *         description: Accès refusé
 */
router.get('/memoires', isAuth, EtablissementController.getMemoiresByEtablissement);

/**
 * @swagger
 * /etablissement/memoires/{id_memoire}/assign:
 *   put:
 *     summary: Assigner un mémoire à un enseignant
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_memoire
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_enseignant
 *             properties:
 *               id_enseignant:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Mémoire assigné avec succès
 *       404:
 *         description: Mémoire introuvable
 *       403:
 *         description: Accès refusé
 */
router.put('/memoires/:id_memoire/assign', isAuth, EtablissementController.assignMemoireToEnseignant);

/**
 * @swagger
 * /etablissement/memoires/{id_memoire}/status:
 *   put:
 *     summary: Mettre à jour le statut d'un mémoire
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_memoire
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - statut
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [en_preparation, en_attente, accepte, refuse, soutenu]
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *       404:
 *         description: Mémoire introuvable
 *       403:
 *         description: Accès refusé
 */
router.put('/memoires/:id_memoire/status', isAuth, EtablissementController.updateMemoireStatusByEtablissement);

/**
 * @swagger
 * /etablissement/all-enseignants:
 *   get:
 *     summary: Récupérer tous les enseignants existants
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Liste de tous les enseignants
 *       403:
 *         description: Accès refusé
 */
router.get('/all-enseignants', isAuth, EtablissementController.getAllExistingEnseignants);

/**
 * @swagger
 * /etablissement/all-stagiaires:
 *   get:
 *     summary: Récupérer tous les stagiaires existants
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Liste de tous les stagiaires
 *       403:
 *         description: Accès refusé
 */
router.get('/all-stagiaires', isAuth, EtablissementController.getAllExistingStagiaires);

/**
 * @swagger
 * /etablissement/enseignants/{id_enseignant}/create-account:
 *   post:
 *     summary: Créer un compte pour un enseignant existant
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_enseignant
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Enseignant introuvable
 *       409:
 *         description: Compte déjà existant
 */
router.post('/enseignants/:id_enseignant/create-account', isAuth, EtablissementController.createAccountForEnseignant);

/**
 * @swagger
 * /etablissement/stagiaires/{id_stagiaire}/create-account:
 *   post:
 *     summary: Créer un compte pour un stagiaire existant
 *     tags: [Etablissement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_stagiaire
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Stagiaire introuvable
 *       409:
 *         description: Compte déjà existant
 */
router.post('/stagiaires/:id_stagiaire/create-account', isAuth, EtablissementController.createAccountForStagiaire);

router.get('/stagiaires/search', isAuth, EtablissementController.searchExistingStagiaires);

// Get all inscriptions for a specific stagiaire (including those from other establishments)
router.get('/stagiaires/:id_stagiaire/inscriptions', isAuth, EtablissementController.getAllInscriptionsForStagiaire);

module.exports = router;