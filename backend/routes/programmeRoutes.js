const express = require('express');
const router = express.Router();
const ProgrammeController = require('../controllers/ProgrammeController');
const { isAuth, isRegional, isNational, isEnseignant } = require('../middlewares/auth');

// Routes publiques (avec authentification de base)

// Récupérer tous les programmes (pour admin/supervision)
router.get('/', isAuth, ProgrammeController.getAllProgrammes);

// Récupérer programmes par statut
router.get('/status/:status', isAuth, ProgrammeController.getProgrammesByStatus);

// Récupérer programmes d'un établissement régional
router.get('/etablissement/:id_etab_regionale', isAuth, ProgrammeController.getProgrammesByEtablissementRegional);

// Récupérer programmes pour un enseignant (validés uniquement)
router.get('/enseignant/:id_enseignant', isAuth, isEnseignant, ProgrammeController.getProgrammesByEnseignant);

// Servir les fichiers PDF
router.get('/pdf/:filename', isAuth, ProgrammeController.servePDF);

// Statistiques des programmes
router.get('/stats', isAuth, ProgrammeController.getProgrammeStats);

// Compter les institutions qui ont soumis des programmes
router.get('/institutions-count', isAuth, isNational, ProgrammeController.getInstitutionsWithProgrammesCount);

// Activités récentes
router.get('/recent-activities', isAuth, ProgrammeController.getRecentActivities);

// Routes pour établissement régional

// Créer un nouveau programme (avec upload)
router.post('/', 
  isAuth, 
  isRegional, 
  ProgrammeController.uploadPDF,
  ProgrammeController.createProgramme
);

// Mettre à jour un programme (avec upload optionnel)
router.put('/:id', 
  isAuth, 
  isRegional, 
  ProgrammeController.uploadPDF,
  ProgrammeController.updateProgramme
);

// Supprimer un programme
router.delete('/:id', isAuth, isRegional, ProgrammeController.deleteProgramme);

// Routes pour établissement national

// Valider un programme
router.post('/:id/validate', isAuth, isNational, ProgrammeController.validateProgramme);

// Refuser un programme
router.post('/:id/reject', isAuth, isNational, ProgrammeController.rejectProgramme);

module.exports = router;