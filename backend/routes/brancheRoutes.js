const express = require('express');
const router = express.Router();
const AuxiliaryController = require('../controllers/AuxiliaryController');
const { isAuth } = require('../middlewares/auth');

// Récupérer toutes les branches
router.get('/', isAuth, AuxiliaryController.getBranches);

// Récupérer le nombre de branches
router.get('/count', isAuth, AuxiliaryController.getBranchesCount);

// Récupérer toutes les branches avec spécialités et modules
router.get('/with-details', isAuth, AuxiliaryController.getAllBranchesWithDetails);

// Récupérer les spécialités d'une branche spécifique
router.get('/:id_branche/specialites', isAuth, AuxiliaryController.getSpecialitiesByBranch);

module.exports = router;
