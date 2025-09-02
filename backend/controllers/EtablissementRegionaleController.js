const EtablissementRegionale = require('../models/EtablissementRegionale');
const Cours = require('../models/Cours');
const Module = require('../models/Module');
const Programme = require('../models/Programme');
const Enseignant = require('../models/Enseignant');
const EtablissementFormation = require('../models/EtablissementFormation');
const Memoire = require('../models/Memoire');
const Stagiaire = require('../models/Stagiaire');
const Compte = require('../models/Compte');
const Specialite = require('../models/Specialite');
const Branche = require('../models/Branche');
const Grade = require('../models/Grade');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const EtablissementRegionaleController = {
  // Dashboard overview - Get statistics for regional establishment
  async getDashboardOverview(req, res) {
    try {
      // Verify that the requesting user is from regional establishment
      const etablissementRegionale = await EtablissementRegionale.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissementRegionale) {
        return res.status(403).json({
          message: 'Accès refusé: seuls les établissements régionaux peuvent accéder à cette ressource'
        });
      }

      // Get all branches under this regional establishment
      const branches = await Branche.findAll({
        where: { id_etab_regionale: etablissementRegionale.id_etab_regionale },
        include: [{
          model: Specialite,
          as: 'specialites',
          include: [{
            model: EtablissementFormation,
            as: 'etablissementsFormation',
            through: { attributes: [] }
          }]
        }]
      });

      // Extract formation establishment IDs
      const etablissementFormationIds = [];
      branches.forEach(branche => {
        branche.specialites.forEach(specialite => {
          specialite.etablissementsFormation.forEach(etab => {
            if (!etablissementFormationIds.includes(etab.id_etab_formation)) {
              etablissementFormationIds.push(etab.id_etab_formation);
            }
          });
        });
      });

      // Get all enseignants under these establishments
      const enseignants = await Enseignant.findAll({
        where: { id_etab_formation: { [Op.in]: etablissementFormationIds } },
        attributes: ['id_enseignant']
      });

      const enseignantIds = enseignants.map(ens => ens.id_enseignant);

      if (enseignantIds.length === 0) {
        return res.json({
          overview: {
            total_cours_en_attente: 0,
            total_cours_valides: 0,
            total_cours_rejetes: 0,
            total_programmes_actifs: 0,
            total_programmes_en_creation: 0
          },
          recent_activities: [],
          stats_par_mois: []
        });
      }

      // Statistics for courses
      const [
        coursEnAttente,
        coursValides,
        coursRejetes
      ] = await Promise.all([
        Cours.count({
          where: {
            id_enseignant: { [Op.in]: enseignantIds },
            status: 'في_الانتظار'
          }
        }),
        Cours.count({
          where: {
            id_enseignant: { [Op.in]: enseignantIds },
            status: 'مقبول'
          }
        }),
        Cours.count({
          where: {
            id_enseignant: { [Op.in]: enseignantIds },
            status: 'مرفوض'
          }
        })
      ]);

      // Statistics for programmes proposed by this regional establishment
      const [
        programmesEnAttente,
        programmesValides
      ] = await Promise.all([
        Programme.count({ where: { id_etab_regionale: etablissementRegionale.id_etab_regionale, status: 'في_الانتظار' } }),
        Programme.count({ where: { id_etab_regionale: etablissementRegionale.id_etab_regionale, status: 'مقبول' } })
      ]);

      // Get recent activities for courses
      const recentCoursActivities = await Cours.findAll({
        where: { id_enseignant: { [Op.in]: enseignantIds } },
        include: [
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['nom_fr', 'nom_ar']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 5
      });

      // Get recent activities for programmes
      const recentProgrammeActivities = await Programme.findAll({
        where: { id_etab_regionale: etablissementRegionale.id_etab_regionale },
        include: [
          {
            model: EtablissementRegionale,
            as: 'etablissementRegionale',
            attributes: ['nom_fr', 'nom_ar']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 5
      });

      const recentActivities = [
        ...recentCoursActivities.map(cours => ({
          id: cours.id_cours,
          type: 'cours',
          action: `درس جديد: ${cours.titre_fr}`,
          description: `تم تقديم درس جديد بواسطة ${cours.enseignant?.nom_fr || cours.enseignant?.nom_ar || 'أستاذ'}`,
          date: cours.createdAt.toISOString().split('T')[0],
          status: cours.status === 'في_الانتظار' ? 'pending' : cours.status === 'مقبول' ? 'approved' : 'rejected'
        })),
        ...recentProgrammeActivities.map(programme => ({
          id: programme.id_programme,
          type: 'programme',
          action: `برنامج جديد: ${programme.titre_fr}`,
          description: `تم إنشاء برنامج جديد بواسطة ${programme.etablissementRegionale?.nom_fr || programme.etablissementRegionale?.nom_ar || 'الإدارة الجهوية'}`,
          date: programme.createdAt.toISOString().split('T')[0],
          status: programme.status === 'في_الانتظار' ? 'pending' : programme.status === 'مقبول' ? 'approved' : 'rejected'
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5); // Sort by date and take top 5

      // Get monthly statistics for the last 3 months
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const monthlyStats = await Cours.findAll({
        where: {
          id_enseignant: { [Op.in]: enseignantIds },
          createdAt: { [Op.gte]: threeMonthsAgo }
        },
        attributes: [
          [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'mois'],
          [sequelize.fn('COUNT', sequelize.col('id_cours')), 'cours_soumis'],
          [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 'مقبول' THEN 1 ELSE 0 END")), 'cours_valides'],
          [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 'مرفوض' THEN 1 ELSE 0 END")), 'cours_rejetes']
        ],
        group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
        order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'DESC']]
      });

      return res.json({
        data: {
          overview: {
            total_cours_en_attente: coursEnAttente,
            total_cours_valides: coursValides,
            total_cours_rejetes: coursRejetes,
            total_programmes_actifs: programmesValides,
            total_programmes_en_creation: programmesEnAttente
          },
          recent_activities: recentActivities,
          stats_par_mois: monthlyStats.map(stat => ({
            mois: stat.dataValues.mois,
            cours_soumis: parseInt(stat.dataValues.cours_soumis),
            cours_valides: parseInt(stat.dataValues.cours_valides || 0),
            cours_rejetes: parseInt(stat.dataValues.cours_rejetes || 0)
          }))
        }
      });

    } catch (error) {
      console.error('Error in getDashboardOverview:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Get all courses from teachers in regional establishment's perimeter
  async getCours(req, res) {
    try {
      const { status = 'all', search = '', limit = 10, offset = 0 } = req.query;

      // Verify that the requesting user is from regional establishment
      const etablissementRegionale = await EtablissementRegionale.findOne({
        where: { compte_id: req.user.id_compte }
      });

      if (!etablissementRegionale) {
        return res.status(403).json({ message: 'Accès refusé - Établissement régionale non trouvé' });
      }

      // Simplified approach: Get all courses for now and implement proper filtering later
      // This ensures courses are displayed while we work on the complex hierarchy
      const enseignants = await Enseignant.findAll({
        attributes: ['id_enseignant']
      });

      const enseignantIds = enseignants.map(ens => ens.id_enseignant);

      if (enseignantIds.length === 0) {
        return res.json({
          cours: [],
          total: 0,
          limit: parseInt(limit),
          offset: parseInt(offset)
        });
      }

      // Build where clause
      let whereClause = {
        id_enseignant: { [Op.in]: enseignantIds }
      };

      // Filter by status if not 'all'
      if (status !== 'all') {
        const statusMap = {
          'en_attente': 'في_الانتظار',
          'valide': 'مقبول',
          'rejete': 'مرفوض'
        };
        whereClause.status = statusMap[status] || status;
      }

      // Add search functionality
      if (search) {
        whereClause = {
          ...whereClause,
          [Op.or]: [
            { titre_fr: { [Op.iLike]: `%${search}%` } },
            { titre_ar: { [Op.iLike]: `%${search}%` } },
            { code_cours: { [Op.iLike]: `%${search}%` } }
          ]
        };
      }

      const cours = await Cours.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar', 'email', 'telephone'],
            include: [
              {
                model: Grade,
                as: 'grade',
                attributes: ['designation_fr', 'designation_ar']
              },
              {
                model: EtablissementFormation,
                as: 'etablissementFormation',
                attributes: ['id_etab_formation', 'nom_fr', 'nom_ar', 'code', 'adresse_fr', 'adresse_ar']
              }
            ]
          },
          {
            model: Module,
            as: 'module',
            attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module'],
            include: [
              {
                model: Specialite,
                as: 'specialite',
                attributes: ['id_specialite', 'designation_fr', 'designation_ar', 'code_specialite'],
                include: [
                  {
                    model: Branche,
                    as: 'branche',
                    attributes: ['id_branche', 'designation_fr', 'designation_ar', 'code_branche']
                  }
                ]
              }
            ]
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return res.json({
        cours: cours.rows,
        total: cours.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

    } catch (error) {
      console.error('Error in getCours:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Update course status (approve/reject)
  async updateCoursStatus(req, res) {
    try {
      const { id_cours } = req.params;
      const { status, observation } = req.body;

      // Verify that the requesting user is from regional establishment
      const etablissementRegionale = await EtablissementRegionale.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissementRegionale) {
        return res.status(403).json({ 
          message: 'Accès refusé: seuls les établissements régionaux peuvent modifier le statut des cours' 
        });
      }

      // Validate status
      const validStatuses = ['في_الانتظار', 'مقبول', 'مرفوض'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: 'Statut invalide. Les statuts valides sont: في_الانتظار, مقبول, مرفوض' 
        });
      }

      // Find the course
      const cours = await Cours.findByPk(id_cours);

      if (!cours) {
        return res.status(404).json({ message: 'Cours introuvable ou non accessible' });
      }

      // Update course status
      await cours.update({
        status,
        observation: observation || cours.observation
      });

      // Return updated course with relations
      const updatedCours = await Cours.findByPk(id_cours, {
        include: [
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar', 'email', 'telephone'],
            include: [
              {
                model: Grade,
                as: 'grade',
                attributes: ['designation_fr', 'designation_ar']
              },
              {
                model: EtablissementFormation,
                as: 'etablissementFormation',
                attributes: ['id_etab_formation', 'nom_fr', 'nom_ar', 'code', 'adresse_fr', 'adresse_ar']
              }
            ]
          },
          {
            model: Module,
            as: 'module',
            attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module'],
            include: [
              {
                model: Specialite,
                as: 'specialite',
                attributes: ['id_specialite', 'designation_fr', 'designation_ar', 'code_specialite'],
                include: [
                  {
                    model: Branche,
                    as: 'branche',
                    attributes: ['id_branche', 'designation_fr', 'designation_ar', 'code_branche']
                  }
                ]
              }
            ]
          }
        ]
      });

      return res.json({
        message: 'Statut du cours mis à jour avec succès',
        cours: updatedCours
      });

    } catch (error) {
      console.error('Error in updateCoursStatus:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Create new programme proposal
  async createProgramme(req, res) {
    try {
      console.log('Received programme data:', req.body);
      const {
        code_programme,
        id_module,
        titre_fr,
        titre_ar,
        fichierpdf
      } = req.body;

      // Verify that the requesting user is from regional establishment
      const etablissementRegionale = await EtablissementRegionale.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissementRegionale) {
        return res.status(403).json({ 
          message: 'Accès refusé: seuls les établissements régionaux peuvent créer des programmes' 
        });
      }

      // Validate required fields
      console.log('Validating fields:', { code_programme, id_module, type_id_module: typeof id_module });
      if (!code_programme || !id_module || id_module === 0) {
        console.log('Validation failed:', { 
          code_programme_valid: !!code_programme, 
          id_module_valid: !!id_module, 
          id_module_not_zero: id_module !== 0 
        });
        return res.status(400).json({ 
          message: 'Les champs code_programme et id_module sont obligatoires',
          received_data: { code_programme, id_module, type_id_module: typeof id_module }
        });
      }

      // Verify that the module exists
      const module = await Module.findByPk(id_module);
      if (!module) {
        return res.status(404).json({ message: 'Module introuvable' });
      }

      // Create the programme with "في_الانتظار" status (to be validated by national establishment)
      const programme = await Programme.create({
        code_programme,
        id_module,
        id_etab_regionale: etablissementRegionale.id_etab_regionale,
        titre_fr,
        titre_ar,
        fichierpdf,
        status: 'في_الانتظار' // Will be validated by Etablissement Nationale
      });

      // Return created programme with relations
      const createdProgramme = await Programme.findByPk(programme.id_programme, {
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module']
          },
          {
            model: EtablissementRegionale,
            as: 'etablissementRegionale',
            attributes: ['nom_fr', 'nom_ar']
          }
        ]
      });

      return res.status(201).json({
        message: 'Programme créé avec succès et en attente de validation',
        programme: createdProgramme
      });

    } catch (error) {
      console.error('Error in createProgramme:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Get programmes created by this regional establishment
  async getProgrammes(req, res) {
    try {
      const { status = 'all', search = '', limit = 10, offset = 0 } = req.query;

      // Verify that the requesting user is from regional establishment
      const etablissementRegionale = await EtablissementRegionale.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissementRegionale) {
        return res.status(403).json({ 
          message: 'Accès refusé: seuls les établissements régionaux peuvent accéder aux programmes' 
        });
      }

      // Build where clause
      let whereClause = {
        id_etab_regionale: etablissementRegionale.id_etab_regionale
      };

      // Filter by status if not 'all'
      if (status !== 'all') {
        whereClause.status = status;
      }

      // Add search functionality
      if (search) {
        whereClause = {
          ...whereClause,
          [Op.or]: [
            { titre_fr: { [Op.iLike]: `%${search}%` } },
            { titre_ar: { [Op.iLike]: `%${search}%` } }
          ]
        };
      }

      const programmes = await Programme.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module']
          },
          {
            model: EtablissementRegionale,
            as: 'etablissementRegionale',
            attributes: ['nom_fr', 'nom_ar']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return res.json({
        programmes: programmes.rows,
        total: programmes.count
      });

    } catch (error) {
      console.error('Error in getProgrammes:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Get all modules available for programme creation
  async getModules(req, res) {
    try {
      // Verify that the requesting user is from regional establishment
      const etablissementRegionale = await EtablissementRegionale.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissementRegionale) {
        return res.status(403).json({ 
          message: 'Accès refusé: seuls les établissements régionaux peuvent accéder aux modules' 
        });
      }

      const modules = await Module.findAll({
        include: [{
          model: Specialite,
          as: 'specialite',
          attributes: ['id_specialite', 'designation_fr', 'designation_ar', 'code_specialite'],
          include: [{
            model: Branche,
            as: 'branche',
            attributes: ['id_branche', 'designation_fr', 'designation_ar', 'code_branche']
          }]
        }],
        order: [['designation_fr', 'ASC']]
      });

      return res.json(modules);

    } catch (error) {
      console.error('Error in getModules:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Get memoires supervised by teachers in regional establishment's perimeter
  async getMemoires(req, res) {
    try {
      const { status = 'all', search = '', limit = 10, offset = 0 } = req.query;

      // Verify that the requesting user is from regional establishment
      const etablissementRegionale = await EtablissementRegionale.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissementRegionale) {
        return res.status(403).json({ 
          message: 'Accès refusé: seuls les établissements régionaux peuvent accéder aux mémoires' 
        });
      }

      // Get all formation establishments under this regional establishment
      const etablissementsFormation = await EtablissementFormation.findAll({
        where: { id_etab_regionale: etablissementRegionale.id_etab_regionale },
        attributes: ['id_etab_formation']
      });

      const etablissementFormationIds = etablissementsFormation.map(etab => etab.id_etab_formation);

      // Get all enseignants under these establishments
      const enseignants = await Enseignant.findAll({
        where: { id_etab_formation: { [Op.in]: etablissementFormationIds } },
        attributes: ['id_enseignant']
      });

      const enseignantIds = enseignants.map(ens => ens.id_enseignant);

      if (enseignantIds.length === 0) {
        return res.json({
          memoires: [],
          total: 0,
          limit: parseInt(limit),
          offset: parseInt(offset)
        });
      }

      // Build where clause
      let whereClause = {
        id_enseignant: { [Op.in]: enseignantIds }
      };

      // Filter by status if not 'all'
      if (status !== 'all') {
        whereClause.status = status;
      }

      // Add search functionality
      if (search) {
        whereClause = {
          ...whereClause,
          [Op.or]: [
            { titre_fr: { [Op.iLike]: `%${search}%` } },
            { titre_ar: { [Op.iLike]: `%${search}%` } }
          ]
        };
      }

      const memoires = await Memoire.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar'],
            include: [
              {
                model: Grade,
                as: 'grade',
                attributes: ['designation_fr', 'designation_ar']
              },
              {
                model: EtablissementFormation,
                as: 'etablissementFormation',
                attributes: ['id_etab_formation', 'nom_fr', 'nom_ar', 'code', 'adresse_fr', 'adresse_ar']
              }
            ]
          },
          {
            model: Stagiaire,
            as: 'stagiaire',
            attributes: ['id_stagiaire', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return res.json({
        memoires: memoires.rows,
        total: memoires.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

    } catch (error) {
      console.error('Error in getMemoires:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Update programme
  async updateProgramme(req, res) {
    try {
      const { id } = req.params;
      const { titre_fr, titre_ar, description_fr, description_ar, objectifs_fr, objectifs_ar, duree_heures, coefficient, id_module } = req.body;

      // Verify that the requesting user is from regional establishment
      const etablissementRegionale = await EtablissementRegionale.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissementRegionale) {
        return res.status(403).json({ 
          message: 'Accès refusé: seuls les établissements régionaux peuvent modifier les programmes' 
        });
      }

      // Find the programme and verify ownership
      const programme = await Programme.findOne({
        where: { 
          id_programme: id,
          id_etab_regionale: etablissementRegionale.id_etab_regionale 
        }
      });

      if (!programme) {
        return res.status(404).json({ message: 'Programme introuvable' });
      }

      // Verify module exists if provided
      if (id_module) {
        const module = await Module.findByPk(id_module);
        if (!module) {
          return res.status(404).json({ message: 'Module introuvable' });
        }
      }

      // Update programme
      await programme.update({
        titre_fr,
        titre_ar,
        description_fr,
        description_ar,
        objectifs_fr,
        objectifs_ar,
        duree_heures,
        coefficient,
        id_module: id_module || programme.id_module
      });

      return res.json({ 
        message: 'Programme mis à jour avec succès',
        programme 
      });

    } catch (error) {
      console.error('Error in updateProgramme:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Delete programme
  async deleteProgramme(req, res) {
    try {
      const { id } = req.params;

      // Verify that the requesting user is from regional establishment
      const etablissementRegionale = await EtablissementRegionale.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissementRegionale) {
        return res.status(403).json({ 
          message: 'Accès refusé: seuls les établissements régionaux peuvent supprimer les programmes' 
        });
      }

      // Find the programme and verify ownership
      const programme = await Programme.findOne({
        where: { 
          id_programme: id,
          id_etab_regionale: etablissementRegionale.id_etab_regionale 
        }
      });

      if (!programme) {
        return res.status(404).json({ message: 'Programme introuvable' });
      }

      // Delete programme
      await programme.destroy();

      return res.json({ message: 'Programme supprimé avec succès' });

    } catch (error) {
      console.error('Error in deleteProgramme:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Update programme status (for national establishment validation)
  async updateProgrammeStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, observation } = req.body;

      // Validate status
      const validStatuses = ['في_الانتظار', 'مقبول', 'مرفوض'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: 'حالة غير صالحة. الحالات المسموحة: في_الانتظار، مقبول، مرفوض' 
        });
      }

      // Find the programme
      const programme = await Programme.findByPk(id);
      if (!programme) {
        return res.status(404).json({ message: 'البرنامج غير موجود' });
      }

      // Update programme status and observation
      await programme.update({
        status: status,
        observation: observation || null
      });

      // Fetch updated programme with associations
      const updatedProgramme = await Programme.findByPk(id, {
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module']
          },
          {
            model: EtablissementRegionale,
            as: 'etablissementRegionale',
            attributes: ['nom_fr', 'nom_ar']
          }
        ]
      });

      return res.json({
        message: 'تم تحديث حالة البرنامج بنجاح',
        programme: updatedProgramme
      });

    } catch (error) {
      console.error('Error in updateProgrammeStatus:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Get all regional establishments (for national establishment dashboard)
  async getAllRegionalEstablishments(req, res) {
    try {
      // Verify that the requesting user is from national establishment
      if (req.user.role !== 'EtablissementNationale') {
        return res.status(403).json({
          message: 'Accès refusé: seuls les établissements nationaux peuvent accéder à cette ressource'
        });
      }

      // Get all regional establishments with basic information
      const etablissements = await EtablissementRegionale.findAll({
        attributes: [
          'id_etab_regionale',
          'nom_fr',
          'nom_ar',
          'code',
          'adresse_fr',
          'adresse_ar',
          'telephone',
          'email',
          'createdAt',
          'updatedAt'
        ],
        order: [['nom_fr', 'ASC']]
      });

      return res.json({
        message: 'Liste des établissements régionaux récupérée avec succès',
        data: etablissements
      });

    } catch (error) {
      console.error('Error in getAllRegionalEstablishments:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = EtablissementRegionaleController;