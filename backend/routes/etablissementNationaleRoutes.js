const express = require('express');
const router = express.Router();

const EtablissementNationaleController = require('../controllers/EtablissementNationaleController');
const { isAuth } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: EtablissementNationale
 *   description: Gestion des établissements nationaux
 */

/**
 * @swagger
 * /etablissement/nationale:
 *   post:
 *     summary: Créer un établissement national
 *     tags: [EtablissementNationale]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, nom_fr, nom_ar, compte_id]
 *             properties:
 *               code:
 *                 type: string
 *                 description: Code unique de l'établissement
 *               nom_fr:
 *                 type: string
 *                 description: Nom français de l'établissement
 *               nom_ar:
 *                 type: string
 *                 description: Nom arabe de l'établissement
 *               adresse_fr:
 *                 type: string
 *                 description: Adresse française
 *               adresse_ar:
 *                 type: string
 *                 description: Adresse arabe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email de l'établissement
 *               telephone:
 *                 type: string
 *                 description: Téléphone de l'établissement
 *               compte_id:
 *                 type: integer
 *                 description: ID du compte associé
 *     responses:
 *       201:
 *         description: Établissement national créé avec succès
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Code déjà existant
 */
router.post('/', EtablissementNationaleController.create);

/**
 * @swagger
 * /etablissement/nationale/{id}:
 *   get:
 *     summary: Récupérer un établissement national par ID
 *     tags: [EtablissementNationale]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Établissement national trouvé
 *       404:
 *         description: Établissement national non trouvé
 */
router.get('/:id', EtablissementNationaleController.getById);

/**
 * @swagger
 * /etablissement/nationale/{id}:
 *   put:
 *     summary: Mettre à jour un établissement national
 *     tags: [EtablissementNationale]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               nom_fr:
 *                 type: string
 *               nom_ar:
 *                 type: string
 *               adresse_fr:
 *                 type: string
 *               adresse_ar:
 *                 type: string
 *               email:
 *                 type: string
 *               telephone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Établissement national mis à jour
 *       404:
 *         description: Établissement national non trouvé
 */
router.put('/:id', isAuth, EtablissementNationaleController.update);

/**
 * @swagger
 * /etablissement/nationale/{id}:
 *   delete:
 *     summary: Supprimer un établissement national
 *     tags: [EtablissementNationale]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Établissement national supprimé
 *       404:
 *         description: Établissement national non trouvé
 */
router.delete('/:id', isAuth, EtablissementNationaleController.delete);

module.exports = router;
