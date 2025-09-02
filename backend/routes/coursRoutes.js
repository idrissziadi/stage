const express = require('express');
const router = express.Router();

const CoursController = require('../controllers/CoursController');
const { isAuth, isEnseignant, isStagiaire, isRegional } = require('../middlewares/auth');
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

// Récupérer les statistiques des cours
router.get('/stats', isAuth, CoursController.getCoursStats);

/**
 * @swagger
 * /cours/by-modules:
 *   get:
 *     summary: Récupérer tous les cours selon les modules disponibles
 *     tags: [Cours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           description: Filtrer par statut (all, مقبول, في_الانتظار, مرفوض)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           description: Recherche dans le titre ou code du cours
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 1000
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Liste des cours avec modules et enseignants
 *       401:
 *         description: Non authentifié
 */
router.get('/by-modules', isAuth, CoursController.getAllCoursByModules);

/**
 * @swagger
 * /cours/all-status:
 *   get:
 *     summary: Récupérer tous les cours avec tous les statuts
 *     tags: [Cours]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les cours avec modules et enseignants
 *       401:
 *         description: Non authentifié
 */
router.get('/all-status', isAuth, CoursController.getAllCoursWithAllStatus);

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
 * /cours/pdf/{filename}:
 *   get:
 *     summary: Servir un fichier PDF de cours
 *     tags: [Cours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom du fichier PDF
 *     responses:
 *       200:
 *         description: Fichier PDF
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Fichier non trouvé
 */
router.get('/pdf/:filename', isAuth, CoursController.servePDF);

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

/**
 * @swagger
 * /cours/{id_cours}/status:
 *   put:
 *     summary: Mettre à jour le statut d'un cours (pour établissement régionale)
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
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [في_الانتظار, مقبول, مرفوض]
 *               observation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Statut du cours mis à jour
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Cours introuvable
 */
router.put('/:id_cours/status', isAuth, isRegional, CoursController.updateCoursStatus);

/**
 * @swagger
 * /cours/{id_cours}/regional:
 *   put:
 *     summary: Mettre à jour un cours (pour établissement régionale)
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
 *             properties:
 *               observation:
 *                 type: string
 *                 description: Observation sur le cours
 *               status:
 *                 type: string
 *                 enum: [في_الانتظار, مقبول, مرفوض]
 *                 description: Nouveau statut du cours
 *     responses:
 *       200:
 *         description: Cours mis à jour avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Cours introuvable
 */
router.put('/:id_cours/regional', isAuth, isRegional, CoursController.updateCoursRegional);

module.exports = router;
