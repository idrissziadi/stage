const express = require('express');
const router = express.Router();
const AuxiliaryController = require('../controllers/AuxiliaryController');
const { isAuth } = require('../middlewares/auth');

// Récupérer toutes les spécialités
router.get('/', isAuth, AuxiliaryController.getAllSpecialites);

// Récupérer les spécialités par branche
router.get('/branche/:id_branche', isAuth, async (req, res) => {
  try {
    const { id_branche } = req.params;
    const Specialite = require('../models/Specialite');
    
    const specialites = await Specialite.findAll({
      where: { id_branche: parseInt(id_branche) },
      attributes: ['id_specialite', 'designation_fr', 'designation_ar', 'code_specialite', 'id_branche'],
      order: [['designation_fr', 'ASC']]
    });

    return res.json({
      data: specialites,
      total: specialites.length
    });
  } catch (error) {
    console.error('Error fetching specialites by branche:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Récupérer le nombre de spécialités
router.get('/count', isAuth, AuxiliaryController.getSpecialitesCount);

module.exports = router;
