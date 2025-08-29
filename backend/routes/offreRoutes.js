const express = require('express');
const router = express.Router();

const OffreController = require('../controllers/OffreController');
const { isAuth } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Offre
 *   description: Gestion des offres de formation
 */

/**
 * @swagger
 * /offre:
 *   get:
 *     summary: Récupérer toutes les offres
 *     tags: [Offre]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des offres
 */
router.get('/', isAuth, OffreController.getAllOffres);

/**
 * @swagger
 * /offre/etablissement/{id_etab_formation}:
 *   get:
 *     summary: Récupérer les offres d'un établissement
 *     tags: [Offre]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_etab_formation
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des offres de l'établissement
 */
router.get('/etablissement/:id_etab_formation', isAuth, OffreController.getOffresByEtablissement);

/**
 * @swagger
 * /offre:
 *   post:
 *     summary: Créer une nouvelle offre
 *     tags: [Offre]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_specialite
 *               - id_etab_formation
 *               - id_diplome
 *               - id_mode
 *             properties:
 *               id_specialite:
 *                 type: integer
 *               id_etab_formation:
 *                 type: integer
 *               id_diplome:
 *                 type: integer
 *               id_mode:
 *                 type: integer
 *               designation_fr:
 *                 type: string
 *               designation_ar:
 *                 type: string
 *               description:
 *                 type: string
 *               date_debut:
 *                 type: string
 *                 format: date
 *               date_fin:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Offre créée avec succès
 */
router.post('/', isAuth, OffreController.createOffre);

/**
 * @swagger
 * /offre/{id_offre}:
 *   put:
 *     summary: Mettre à jour une offre
 *     tags: [Offre]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_offre
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
 *         description: Offre mise à jour avec succès
 */
router.put('/:id_offre', isAuth, OffreController.updateOffre);

/**
 * @swagger
 * /offre/{id_offre}:
 *   delete:
 *     summary: Supprimer une offre
 *     tags: [Offre]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_offre
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Offre supprimée avec succès
 */
router.delete('/:id_offre', isAuth, OffreController.deleteOffre);

module.exports = router;
