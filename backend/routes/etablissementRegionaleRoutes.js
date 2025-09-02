const express = require('express');
const router = express.Router();
const EtablissementRegionaleController = require('../controllers/EtablissementRegionaleController');
const { isAuth } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: EtablissementRegionale
 *   description: API pour les établissements régionaux
 */

/**
 * @swagger
 * /etablissement-regionale:
 *   get:
 *     summary: Récupérer tous les établissements régionaux
 *     tags: [EtablissementRegionale]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des établissements régionaux
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_etab_regionale:
 *                         type: integer
 *                       nom_fr:
 *                         type: string
 *                       nom_ar:
 *                         type: string
 *                       code:
 *                         type: string
 *                       adresse:
 *                         type: string
 *                       telephone:
 *                         type: string
 *                       email:
 *                         type: string
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
router.get('/', isAuth, EtablissementRegionaleController.getAllRegionalEstablishments);

/**
 * @swagger
 * /etablissement-regionale/dashboard:
 *   get:
 *     summary: Récupérer les statistiques du tableau de bord
 *     tags: [EtablissementRegionale]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques du tableau de bord
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 etablissement:
 *                   type: object
 *                   properties:
 *                     nom_fr:
 *                       type: string
 *                     nom_ar:
 *                       type: string
 *                     code:
 *                       type: string
 *                 cours:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     en_attente:
 *                       type: integer
 *                     valides:
 *                       type: integer
 *                     rejetes:
 *                       type: integer
 *                 memoires:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     en_attente:
 *                       type: integer
 *                     acceptes:
 *                       type: integer
 *                 programmes:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     en_attente:
 *                       type: integer
 *                     valides:
 *                       type: integer
 *                     rejetes:
 *                       type: integer
 *       403:
 *         description: Accès refusé
 */
router.get('/dashboard', isAuth, EtablissementRegionaleController.getDashboardOverview);

/**
 * @swagger
 * /etablissement-regionale/cours:
 *   get:
 *     summary: Récupérer les cours du périmètre de l'établissement régional
 *     tags: [EtablissementRegionale]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, en_attente, valide, rejete]
 *           default: all
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Liste des cours avec pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cours:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *       403:
 *         description: Accès refusé
 */
router.get('/cours', isAuth, EtablissementRegionaleController.getCours);

/**
 * @swagger
 * /etablissement-regionale/cours/{id_cours}/status:
 *   put:
 *     summary: Mettre à jour le statut d'un cours
 *     tags: [EtablissementRegionale]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [في_الانتظار, مقبول, مرفوض]
 *                 description: Nouveau statut du cours
 *               observation:
 *                 type: string
 *                 description: Observations sur le cours
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *       400:
 *         description: Statut invalide
 *       404:
 *         description: Cours introuvable
 *       403:
 *         description: Accès refusé
 */
router.put('/cours/:id_cours/status', isAuth, EtablissementRegionaleController.updateCoursStatus);

/**
 * @swagger
 * /etablissement-regionale/programmes:
 *   get:
 *     summary: Récupérer les programmes proposés par l'établissement régional
 *     tags: [EtablissementRegionale]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, en_attente, valide, rejete]
 *           default: all
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Liste des programmes avec pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 programmes:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *       403:
 *         description: Accès refusé
 *   post:
 *     summary: Créer un nouveau programme pédagogique
 *     tags: [EtablissementRegionale]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_module
 *               - titre_fr
 *               - titre_ar
 *             properties:
 *               id_module:
 *                 type: integer
 *               titre_fr:
 *                 type: string
 *               titre_ar:
 *                 type: string
 *               description_fr:
 *                 type: string
 *               description_ar:
 *                 type: string
 *               objectifs_fr:
 *                 type: string
 *               objectifs_ar:
 *                 type: string
 *               duree_heures:
 *                 type: integer
 *               coefficient:
 *                 type: number
 *     responses:
 *       201:
 *         description: Programme créé avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Module introuvable
 */
router.get('/programmes', isAuth, EtablissementRegionaleController.getProgrammes);
router.post('/programmes', isAuth, EtablissementRegionaleController.createProgramme);
router.put('/programmes/:id', isAuth, EtablissementRegionaleController.updateProgramme);
router.delete('/programmes/:id', isAuth, EtablissementRegionaleController.deleteProgramme);

// Update programme status (for national establishment validation)
router.patch('/programmes/:id/status', isAuth, EtablissementRegionaleController.updateProgrammeStatus);

/**
 * @swagger
 * /etablissement-regionale/modules:
 *   get:
 *     summary: Récupérer tous les modules disponibles pour créer des programmes
 *     tags: [EtablissementRegionale]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des modules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       403:
 *         description: Accès refusé
 */
router.get('/modules', isAuth, EtablissementRegionaleController.getModules);

/**
 * @swagger
 * /etablissement-regionale/memoires:
 *   get:
 *     summary: Récupérer les mémoires supervisés par les enseignants du périmètre
 *     tags: [EtablissementRegionale]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, en_preparation, en_attente, accepte, refuse, soutenu]
 *           default: all
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Liste des mémoires avec pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 memoires:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *       403:
 *         description: Accès refusé
 */
router.get('/memoires', isAuth, EtablissementRegionaleController.getMemoires);

module.exports = router;