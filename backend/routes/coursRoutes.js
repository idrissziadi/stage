const express = require('express');
const router = express.Router();

const CoursController = require('../controllers/CoursController');
const { isAuth, isEnseignant, isStagiaire } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

/**
 * @swagger
 * tags:
 *   name: Cours
 *   description: Gestion des cours
 */

/**
 * @swagger
 * /cours:
 *   get:
 *     summary: Récupérer tous les cours approuvés
 *     tags: [Cours]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des cours
 *       401:
 *         description: Non authentifié
 */
router.get('/', isAuth, CoursController.getAllCours);

/**
 * @swagger
 * /cours/enseignant/{id_enseignant}:
 *   get:
 *     summary: Récupérer les cours d'un enseignant
 *     tags: [Cours]
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
 *         description: Cours de l'enseignant
 *       401:
 *         description: Non authentifié
 */
router.get('/enseignant/:id_enseignant', isAuth, CoursController.getCoursByEnseignant);

/**
 * @swagger
 * /cours:
 *   post:
 *     summary: Créer un nouveau cours
 *     tags: [Cours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Cours créé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 */
router.post('/', isAuth, isEnseignant, CoursController.createCours);

/**
 * @swagger
 * /cours/upload:
 *   post:
 *     summary: Créer un nouveau cours avec upload de fichier PDF
 *     tags: [Cours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               code_cours:
 *                 type: string
 *                 description: Code du cours
 *               titre_fr:
 *                 type: string
 *                 description: Titre en français
 *               titre_ar:
 *                 type: string
 *                 description: Titre en arabe
 *               id_module:
 *                 type: integer
 *                 description: ID du module
 *               fichierpdf:
 *                 type: string
 *                 format: binary
 *                 description: Fichier PDF du cours
 *     responses:
 *       201:
 *         description: Cours créé avec succès
 *       400:
 *         description: Erreur de validation ou fichier manquant
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 */
router.post('/upload', isAuth, isEnseignant, upload.single('fichierpdf'), CoursController.createCoursWithFile);

/**
 * @swagger
 * /cours/{id_cours}:
 *   put:
 *     summary: Mettre à jour un cours
 *     tags: [Cours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_cours
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
 *         description: Cours mis à jour
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Cours introuvable
 */
router.put('/:id_cours', isAuth, isEnseignant, CoursController.updateCours);

/**
 * @swagger
 * /cours/{id_cours}:
 *   delete:
 *     summary: Supprimer un cours
 *     tags: [Cours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_cours
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cours supprimé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Cours introuvable
 */
router.delete('/:id_cours', isAuth, isEnseignant, CoursController.deleteCours);

/**
 * @swagger
 * /cours/enseignant/{id_enseignant}/en-attente:
 *   get:
 *     summary: Récupérer les cours en attente d'un enseignant
 *     tags: [Cours]
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
 *         description: Cours en attente de l'enseignant
 *       401:
 *         description: Non authentifié
 */
router.get('/enseignant/:id_enseignant/en-attente', isAuth, isEnseignant, CoursController.getCoursEnAttenteByEnseignant);

/**
 * @swagger
 * /cours/enseignant/{id_enseignant}/approuves:
 *   get:
 *     summary: Récupérer les cours approuvés pour les modules enseignés par un enseignant
 *     tags: [Cours]
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
 *         description: Cours approuvés pour les modules de l'enseignant
 *       401:
 *         description: Non authentifié
 */
router.get('/enseignant/:id_enseignant/approuves', isAuth, isEnseignant, CoursController.getCoursApprouvesByEnseignant);

/**
 * @swagger
 * /cours/stagiaire/{id_stagiaire}:
 *   get:
 *     summary: Récupérer les cours approuvés pour les spécialités d'un stagiaire
 *     tags: [Cours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_stagiaire
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cours approuvés pour les spécialités du stagiaire
 *       401:
 *         description: Non authentifié
 */
router.get('/stagiaire/:id_stagiaire', isAuth, CoursController.getCoursByStagiaire);

/**
 * @swagger
 * /cours/{id_cours}/exporter:
 *   post:
 *     summary: Exporter un cours (changer le statut vers "في_الانتظار")
 *     tags: [Cours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_cours
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cours exporté avec succès
 *       400:
 *         description: Cours déjà en attente
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Cours introuvable
 */
router.post('/:id_cours/exporter', isAuth, isEnseignant, CoursController.exporterCours);

/**
 * @swagger
 * /cours/{id_cours}:
 *   get:
 *     summary: Récupérer un cours par ID avec ses détails
 *     tags: [Cours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_cours
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails du cours
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Cours introuvable
 */
router.get('/:id_cours', isAuth, CoursController.getCoursById);

module.exports = router;
