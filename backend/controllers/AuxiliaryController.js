const Grade = require('../models/Grade');
const Specialite = require('../models/Specialite');
const Branche = require('../models/Branche');
const Module = require('../models/Module');
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

  // Get all branches
  async getBranches(req, res) {
    try {
      const branches = await Branche.findAll({
        attributes: ['id_branche', 'designation_fr', 'designation_ar', 'code_branche'],
        order: [['designation_fr', 'ASC']]
      });

      return res.json({
        data: branches,
        total: branches.length
      });

    } catch (error) {
      console.error('Error fetching branches:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des branches', 
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
        data: specialites,
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
      // Return real professional training diplomas
      const diplomes = [
        { id_diplome: 3, designation_fr: 'Qualification', designation_ar: 'التأهيل' },
        { id_diplome: 4, designation_fr: 'Professional Competence', designation_ar: 'الكفاءة المهنية' },
        { id_diplome: 5, designation_fr: 'Professional Control', designation_ar: 'المراقبة المهنية' },
        { id_diplome: 6, designation_fr: 'Technician', designation_ar: 'التقني' },
        { id_diplome: 7, designation_fr: 'Senior Technician', designation_ar: 'التقني العالي' }
      ];

      return res.json({
        data: diplomes,
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
        data: modeFormations,
        total: modeFormations.length
      });

    } catch (error) {
      console.error('Error fetching mode formations:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des modes de formation', 
        error: error.message 
      });
    }
  },

  // Get branches count
  async getBranchesCount(req, res) {
    try {
      const count = await Branche.count();
      return res.json({ count });
    } catch (error) {
      console.error('Error counting branches:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors du comptage des branches', 
        error: error.message 
      });
    }
  },

  // Get specialites count
  async getSpecialitesCount(req, res) {
    try {
      const count = await Specialite.count();
      return res.json({ count });
    } catch (error) {
      console.error('Error counting specialites:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors du comptage des spécialités', 
        error: error.message 
      });
    }
  },

  // Get all branches with specialities and modules count
  async getAllBranchesWithDetails(req, res) {
    try {
      const branches = await Branche.findAll({
        attributes: ['id_branche', 'designation_fr', 'designation_ar', 'code_branche'],
        order: [['designation_fr', 'ASC']],
        include: [
          {
            model: Specialite,
            as: 'specialites',
            attributes: ['id_specialite', 'designation_fr', 'designation_ar', 'code_specialite'],
            include: [
              {
                model: Module,
                as: 'modules',
                attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module']
              }
            ]
          }
        ]
      });

      // Ajouter les compteurs pour chaque branche
      const branchesWithCounts = branches.map(branche => {
        const specialitesCount = branche.specialites ? branche.specialites.length : 0;
        const modulesCount = branche.specialites ? 
          branche.specialites.reduce((total, specialite) => 
            total + (specialite.modules ? specialite.modules.length : 0), 0) : 0;

        return {
          ...branche.toJSON(),
          specialitesCount,
          modulesCount
        };
      });

      return res.json({
        data: branchesWithCounts,
        total: branchesWithCounts.length
      });

    } catch (error) {
      console.error('Error fetching branches with details:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des branches avec détails', 
        error: error.message 
      });
    }
  },

  // Get specialities by branch
  async getSpecialitiesByBranch(req, res) {
    try {
      const { id_branche } = req.params;
      
      const specialites = await Specialite.findAll({
        where: { id_branche: parseInt(id_branche) },
        attributes: ['id_specialite', 'designation_fr', 'designation_ar', 'code_specialite'],
        order: [['designation_fr', 'ASC']],
        include: [
          {
            model: Module,
            as: 'modules',
            attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module']
          }
        ]
      });

      // Ajouter le compteur de modules pour chaque spécialité
      const specialitesWithCounts = specialites.map(specialite => ({
        ...specialite.toJSON(),
        modulesCount: specialite.modules ? specialite.modules.length : 0
      }));

      return res.json({
        data: specialitesWithCounts,
        total: specialitesWithCounts.length
      });

    } catch (error) {
      console.error('Error fetching specialities by branch:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des spécialités par branche', 
        error: error.message 
      });
    }
  }
};

module.exports = AuxiliaryController;