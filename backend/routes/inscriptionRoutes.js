const express = require('express');
const router = express.Router();

const InscriptionController = require('../controllers/InscriptionController');
const { isAuth, isStagiaire, isEtablissementFormation } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Inscription
 *   description: Gestion des inscriptions aux offres
 */

/**
 * @swagger
 * /inscription/stagiaire/{id_stagiaire}:
 *   get:
 *     summary: Récupérer les inscriptions d'un stagiaire
 *     tags: [Inscription]
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
 *         description: Inscriptions du stagiaire
 *       401:
 *         description: Non authentifié
 */
router.get('/stagiaire/:id_stagiaire', isAuth, InscriptionController.getInscriptionsByStagiaire);

/**
 * @swagger
 * /inscription:
 *   post:
 *     summary: Créer une nouvelle inscription
 *     tags: [Inscription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_stagiaire, id_offre]
 *             properties:
 *               id_stagiaire:
 *                 type: string
 *               id_offre:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Inscription créée
 *       401:
 *         description: Non authentifié
 *       409:
 *         description: Inscription déjà existante
 */
router.post('/', isAuth, isStagiaire, InscriptionController.createInscription);

/**
 * @swagger
 * /inscription/{id_inscription}/status:
 *   put:
 *     summary: Mettre à jour le statut d'une inscription
 *     tags: [Inscription]
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
 *             required: [statut]
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [en_attente, acceptee, refusee, annulee]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Inscription introuvable
 */
router.put('/:id_inscription/status', isAuth, isEtablissementFormation, InscriptionController.updateInscriptionStatus);

/**
 * @swagger
 * /inscription/{id_inscription}:
 *   delete:
 *     summary: Supprimer une inscription
 *     tags: [Inscription]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_inscription
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inscription supprimée
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Inscription introuvable
 */
router.delete('/:id_inscription', isAuth, InscriptionController.deleteInscription);

module.exports = router;

