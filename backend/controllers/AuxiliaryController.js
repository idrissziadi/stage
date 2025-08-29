const Grade = require('../models/Grade');
const Specialite = require('../models/Specialite');
// const Diplome = require('../models/Diplome'); // Model doesn't exist yet
const Mode_Formation = require('../models/Mode_Formation');

const AuxiliaryController = {
  // Get all grades
  async getAllGrades(req, res) {
    try {
      const grades = await Grade.findAll({
        attributes: ['id_grade', 'designation_fr', 'designation_ar', 'code_grade'],
        order: [['designation_fr', 'ASC']]
      });

      return res.json({
        grades,
        total: grades.length
      });

    } catch (error) {
      console.error('Error fetching grades:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des grades', 
        error: error.message 
      });
    }
  },

  // Get all specialites
  async getAllSpecialites(req, res) {
    try {
      const specialites = await Specialite.findAll({
        attributes: ['id_specialite', 'designation_fr', 'designation_ar', 'code_specialite'],
        order: [['designation_fr', 'ASC']]
      });

      return res.json({
        specialites,
        total: specialites.length
      });

    } catch (error) {
      console.error('Error fetching specialites:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des spécialités', 
        error: error.message 
      });
    }
  },

  // Get all diplomes
  async getAllDiplomes(req, res) {
    try {
      // For now, return mock data since Diplome model doesn't exist in current schema
      const diplomes = [
        { id_diplome: 1, designation_fr: 'Licence', designation_ar: 'ليسانس' },
        { id_diplome: 2, designation_fr: 'Master', designation_ar: 'ماستر' },
        { id_diplome: 3, designation_fr: 'Doctorat', designation_ar: 'دكتوراه' }
      ];

      return res.json({
        diplomes,
        total: diplomes.length
      });

    } catch (error) {
      console.error('Error fetching diplomes:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des diplômes', 
        error: error.message 
      });
    }
  },

  // Get all mode formations
  async getAllModeFormations(req, res) {
    try {
      const modeFormations = await Mode_Formation.findAll({
        attributes: ['id_mode', 'designation_fr', 'designation_ar'],
        order: [['designation_fr', 'ASC']]
      });

      return res.json({
        modeFormations,
        total: modeFormations.length
      });

    } catch (error) {
      console.error('Error fetching mode formations:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des modes de formation', 
        error: error.message 
      });
    }
  }
};

module.exports = AuxiliaryController;