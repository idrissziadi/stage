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

      // Statistics for courses
      const [
        totalCours,
        coursEnAttente,
        coursValides,
        coursRejetes
      ] = await Promise.all([
        Cours.count({
          where: { id_enseignant: { [Op.in]: enseignantIds } }
        }),
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

      // Statistics for memoires
      const [
        totalMemoires,
        memoiresEnAttente,
        memoiresAcceptes
      ] = await Promise.all([
        Memoire.count({
          where: { id_enseignant: { [Op.in]: enseignantIds } }
        }),
        Memoire.count({
          where: { 
            id_enseignant: { [Op.in]: enseignantIds },
            statut: 'en_attente'
          }
        }),
        Memoire.count({
          where: { 
            id_enseignant: { [Op.in]: enseignantIds },
            statut: 'accepte'
          }
        })
      ]);

      // Statistics for programmes proposed by this regional establishment
      const [
        totalProgrammes,
        programmesEnAttente,
        programmesValides,
        programmesRejetes
      ] = await Promise.all([
        Programme.count({
          where: { id_etab_regionale: etablissementRegionale.id_etab_regionale }
        }),
        Programme.count({
          where: { 
            id_etab_regionale: etablissementRegionale.id_etab_regionale,
            statut: 'en_attente'
          }
        }),
        Programme.count({
          where: { 
            id_etab_regionale: etablissementRegionale.id_etab_regionale,
            statut: 'valide'
          }
        }),
        Programme.count({
          where: { 
            id_etab_regionale: etablissementRegionale.id_etab_regionale,
            statut: 'rejete'
          }
        })
      ]);

      return res.json({
        etablissement: {
          nom_fr: etablissementRegionale.nom_fr,
          nom_ar: etablissementRegionale.nom_ar,
          code: etablissementRegionale.code
        },
        cours: {
          total: totalCours,
          en_attente: coursEnAttente,
          valides: coursValides,
          rejetes: coursRejetes
        },
        memoires: {
          total: totalMemoires,
          en_attente: memoiresEnAttente,
          acceptes: memoiresAcceptes
        },
        programmes: {
          total: totalProgrammes,
          en_attente: programmesEnAttente,
          valides: programmesValides,
          rejetes: programmesRejetes
        },
        etablissements_formation: etablissementsFormation.length,
        enseignants: enseignants.length
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
        return res.status(403).json({ 
          message: 'Accès refusé: seuls les établissements régionaux peuvent accéder aux cours' 
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
        if (statusMap[status]) {
          whereClause.status = statusMap[status];
        }
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
            attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar', 'email'],
            include: [{
              model: Grade,
              as: 'grade',
              attributes: ['designation_fr', 'designation_ar']
            }, {
              model: EtablissementFormation,
              as: 'etablissementformation',
              attributes: ['nom_fr', 'nom_ar']
            }]
          },
          {
            model: Module,
            as: 'module',
            attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module'],
            include: [{
              model: Specialite,
              as: 'specialite',
              attributes: ['designation_fr', 'designation_ar']
            }]
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
      const cours = await Cours.findByPk(id_cours, {
        include: [{
          model: Enseignant,
          as: 'enseignant',
          include: [{
            model: EtablissementFormation,
            as: 'etablissementformation',
            where: { id_etab_regionale: etablissementRegionale.id_etab_regionale }
          }]
        }]
      });

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
            attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar', 'email'],
            include: [{
              model: Grade,
              as: 'grade',
              attributes: ['designation_fr', 'designation_ar']
            }, {
              model: EtablissementFormation,
              as: 'etablissementformation',
              attributes: ['nom_fr', 'nom_ar']
            }]
          },
          {
            model: Module,
            as: 'module',
            attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module']
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
      const {
        id_module,
        titre_fr,
        titre_ar,
        description_fr,
        description_ar,
        objectifs_fr,
        objectifs_ar,
        duree_heures,
        coefficient
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
      if (!id_module || !titre_fr || !titre_ar) {
        return res.status(400).json({ 
          message: 'Les champs id_module, titre_fr et titre_ar sont obligatoires' 
        });
      }

      // Verify that the module exists
      const module = await Module.findByPk(id_module);
      if (!module) {
        return res.status(404).json({ message: 'Module introuvable' });
      }

      // Create the programme with "en_attente" status (to be validated by national establishment)
      const programme = await Programme.create({
        id_module,
        id_etab_regionale: etablissementRegionale.id_etab_regionale,
        titre_fr,
        titre_ar,
        description_fr,
        description_ar,
        objectifs_fr,
        objectifs_ar,
        duree_heures: duree_heures || null,
        coefficient: coefficient || null,
        statut: 'en_attente', // Will be validated by Etablissement Nationale
        date_creation: new Date()
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
            as: 'etablissementregionale',
            attributes: ['id_etab_regionale', 'nom_fr', 'nom_ar', 'code']
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
        whereClause.statut = status;
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
            attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module'],
            include: [{
              model: Specialite,
              as: 'specialite',
              attributes: ['designation_fr', 'designation_ar']
            }]
          },
          {
            model: EtablissementRegionale,
            as: 'etablissementregionale',
            attributes: ['id_etab_regionale', 'nom_fr', 'nom_ar', 'code']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return res.json({
        programmes: programmes.rows,
        total: programmes.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
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
          attributes: ['id_specialite', 'designation_fr', 'designation_ar', 'code_specialite']
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
        whereClause.statut = status;
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
            include: [{
              model: EtablissementFormation,
              as: 'etablissementformation',
              attributes: ['nom_fr', 'nom_ar']
            }]
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
  }
};

module.exports = EtablissementRegionaleController;