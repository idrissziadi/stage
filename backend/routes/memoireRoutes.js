const express = require('express');
const router = express.Router();

const MemoireController = require('../controllers/MemoireController');
const { isAuth, isEnseignant, isStagiaire } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

/**
 * @swagger
 * tags:
 *   name: Memoire
 *   description: Gestion des mémoires
 */

/**
 * @swagger
 * /memoire/stagiaire/{id_stagiaire}:
 *   get:
 *     summary: Récupérer les mémoires d'un stagiaire
 *     tags: [Memoire]
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
 *         description: Mémoires du stagiaire
 *       401:
 *         description: Non authentifié
 */
router.get('/stagiaire/:id_stagiaire', isAuth, MemoireController.getMemoiresByStagiaire);

/**
 * @swagger
 * /memoire/enseignant/{id_enseignant}:
 *   get:
 *     summary: Récupérer les mémoires encadrés par un enseignant
 *     tags: [Memoire]
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
 *         description: Mémoires de l'enseignant
 *       401:
 *         description: Non authentifié
 */
router.get('/enseignant/:id_enseignant', isAuth, MemoireController.getMemoiresByEnseignant);

/**
 * @swagger
 * /memoire/offre/{id_offre}:
 *   get:
 *     summary: Récupérer les mémoires validés d'une offre de formation
 *     tags: [Memoire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_offre
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mémoires validés de l'offre
 *       401:
 *         description: Non authentifié
 */
router.get('/offre/:id_offre', isAuth, MemoireController.getMemoiresByOffre);

/**
 * @swagger
 * /memoire/collaboratifs/{id_stagiaire}:
 *   get:
 *     summary: Récupérer les mémoires collaboratifs pour un stagiaire
 *     tags: [Memoire]
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
 *         description: Mémoires collaboratifs du stagiaire
 *       401:
 *         description: Non authentifié
 */
router.get('/collaboratifs/:id_stagiaire', isAuth, MemoireController.getMemoiresCollaboratifsByStagiaire);

/**
 * @swagger
 * /memoire:
 *   post:
 *     summary: Créer un nouveau mémoire
 *     tags: [Memoire]
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
 *         description: Mémoire créé
 *       401:
 *         description: Non authentifié
 */
router.post('/', isAuth, MemoireController.createMemoire);

/**
 * @swagger
 * /memoire/{id_memoire}:
 *   put:
 *     summary: Mettre à jour un mémoire
 *     tags: [Memoire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_memoire
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Mémoire mis à jour
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Mémoire introuvable
 */
router.put('/:id_memoire', isAuth, MemoireController.updateMemoire);

/**
 * @swagger
 * /memoire/{id_memoire}/upload:
 *   put:
 *     summary: Mettre à jour un mémoire avec upload de fichier PDF
 *     tags: [Memoire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_memoire
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titre_fr:
 *                 type: string
 *                 description: Titre en français
 *               titre_ar:
 *                 type: string
 *                 description: Titre en arabe
 *               observation:
 *                 type: string
 *                 description: Observation ou résumé
 *               fichierpdf:
 *                 type: string
 *                 format: binary
 *                 description: Fichier PDF du mémoire
 *     responses:
 *       200:
 *         description: Mémoire mis à jour avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Mémoire introuvable
 */
router.put('/:id_memoire/upload', isAuth, upload.single('fichierpdf'), MemoireController.updateMemoireWithFile);

/**
 * @swagger
 * /memoire/pdf/{filename}:
 *   get:
 *     summary: Servir un fichier PDF de mémoire
 *     tags: [Memoire]
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
router.get('/pdf/:filename', isAuth, MemoireController.servePDF);

/**
 * @swagger
 * /memoire/{id_memoire}:
 *   delete:
 *     summary: Supprimer un mémoire
 *     tags: [Memoire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_memoire
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mémoire supprimé
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Mémoire introuvable
 */
router.delete('/:id_memoire', isAuth, MemoireController.deleteMemoire);

/**
 * @swagger
 * /memoire/{id_memoire}/status:
 *   put:
 *     summary: Mettre à jour le statut d'un mémoire
 *     tags: [Memoire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_memoire
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Mémoire introuvable
 */
router.put('/:id_memoire/status', isAuth, MemoireController.updateMemoireStatus);

// ==============================================
// DETAILED MEMOIRE MANAGEMENT WORKFLOW ROUTES
// ==============================================

/**
 * @swagger
 * /memoire/assign:
 *   post:
 *     summary: Assigner un stagiaire à un enseignant (Établissement)
 *     tags: [Memoire]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_stagiaire
 *               - id_enseignant
 *             properties:
 *               id_stagiaire:
 *                 type: integer
 *                 description: ID du stagiaire
 *               id_enseignant:
 *                 type: integer
 *                 description: ID de l'enseignant encadreur
 *     responses:
 *       201:
 *         description: Mémoire assigné avec succès
 *       400:
 *         description: Erreur de validation ou stagiaire déjà assigné
 *       401:
 *         description: Non authentifié
 */
router.post('/assign', isAuth, MemoireController.assignStagiaireToEnseignant);

/**
 * @swagger
 * /memoire/stagiaire-single/{id_stagiaire}:
 *   get:
 *     summary: Récupérer le mémoire d'un stagiaire (unique)
 *     tags: [Memoire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_stagiaire
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mémoire du stagiaire
 *       404:
 *         description: Aucun mémoire assigné
 *       401:
 *         description: Non authentifié
 */
router.get('/stagiaire-single/:id_stagiaire', isAuth, MemoireController.getMemoireByStagiaire);

/**
 * @swagger
 * /memoire/stagiaire-update/{id_stagiaire}:
 *   put:
 *     summary: Mettre à jour le mémoire par le stagiaire
 *     tags: [Memoire]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titre_fr:
 *                 type: string
 *                 description: Titre en français
 *               titre_ar:
 *                 type: string
 *                 description: Titre en arabe
 *               fichierpdf:
 *                 type: string
 *                 format: binary
 *                 description: Fichier PDF du mémoire
 *     responses:
 *       200:
 *         description: Mémoire mis à jour avec succès
 *       400:
 *         description: Mémoire non modifiable
 *       404:
 *         description: Aucun mémoire assigné
 *       401:
 *         description: Non authentifié
 */
router.put('/stagiaire-update/:id_stagiaire', isAuth, upload.single('fichierpdf'), MemoireController.updateMemoireByStagiaire);

/**
 * @swagger
 * /memoire/enseignant-validate/{id_enseignant}:
 *   get:
 *     summary: Récupérer les mémoires à valider par l'enseignant
 *     tags: [Memoire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_enseignant
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mémoires à valider
 *       401:
 *         description: Non authentifié
 */
router.get('/enseignant-validate/:id_enseignant', isAuth, MemoireController.getMemoiresToValidateByEnseignant);

/**
 * @swagger
 * /memoire/validate/{id_memoire}:
 *   put:
 *     summary: Valider ou refuser un mémoire (Enseignant)
 *     tags: [Memoire]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ['مقبول', 'مرفوض']
 *                 description: Statut de validation
 *               observation:
 *                 type: string
 *                 description: Observation de l'enseignant
 *     responses:
 *       200:
 *         description: Mémoire validé/refusé avec succès
 *       400:
 *         description: Statut invalide ou mémoire incomplet
 *       403:
 *         description: Non autorisé à valider ce mémoire
 *       404:
 *         description: Mémoire introuvable
 *       401:
 *         description: Non authentifié
 */
router.put('/validate/:id_memoire', isAuth, MemoireController.validateMemoireByEnseignant);

/**
 * @swagger
 * /memoire/colleagues/{id_stagiaire}:
 *   get:
 *     summary: Récupérer les mémoires acceptés des collègues
 *     tags: [Memoire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_stagiaire
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mémoires acceptés des collègues
 *       401:
 *         description: Non authentifié
 */
router.get('/colleagues/:id_stagiaire', isAuth, MemoireController.getAcceptedMemoiresByOffers);

module.exports = router;


