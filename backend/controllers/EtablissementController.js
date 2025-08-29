const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const Compte = require('../models/Compte');
const Enseignant = require('../models/Enseignant');
const Stagiaire = require('../models/Stagiaire');
const EtablissementFormation = require('../models/EtablissementFormation');
const Grade = require('../models/Grade');
const Offre = require('../models/Offre');
const Memoire = require('../models/Memoire');
const Inscription = require('../models/Inscription');
const Specialite = require('../models/Specialite');
const Diplome = require('../models/Diplome');

const EtablissementController = {
  // Get all enseignants for a specific establishment
  async getEnseignantsByEtablissement(req, res) {
    try {
      const { id_etab_formation } = req.params;
      const { search, limit = 50, offset = 0 } = req.query;

      // Verify that the requesting user belongs to this establishment
      const compte = await Compte.findByPk(req.user.id_compte);
      const etablissement = await EtablissementFormation.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissement || etablissement.id_etab_formation !== parseInt(id_etab_formation)) {
        return res.status(403).json({ 
          message: 'Accès refusé: vous ne pouvez accéder qu\'aux données de votre établissement' 
        });
      }

      let whereClause = { id_etab_formation: parseInt(id_etab_formation) };
      
      if (search) {
        whereClause = {
          ...whereClause,
          [Op.or]: [
            { nom_fr: { [Op.iLike]: `%${search}%` } },
            { prenom_fr: { [Op.iLike]: `%${search}%` } },
            { nom_ar: { [Op.iLike]: `%${search}%` } },
            { prenom_ar: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } }
          ]
        };
      }

      const enseignants = await Enseignant.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Grade,
            as: 'grade',
            attributes: ['id_grade', 'designation_fr', 'designation_ar', 'code_grade']
          },
          {
            model: Compte,
            as: 'Compte',
            attributes: ['id_compte', 'username', 'role', 'createdAt']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['nom_fr', 'ASC'], ['prenom_fr', 'ASC']]
      });

      return res.json({
        enseignants: enseignants.rows,
        total: enseignants.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

    } catch (error) {
      console.error('Error fetching enseignants:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des enseignants', 
        error: error.message 
      });
    }
  },

  // Get all stagiaires for a specific establishment (through inscriptions)
  async getStagiairesByEtablissement(req, res) {
    try {
      const { id_etab_formation } = req.params;
      const { search, limit = 50, offset = 0 } = req.query;

      // Verify that the requesting user belongs to this establishment
      const etablissement = await EtablissementFormation.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissement || etablissement.id_etab_formation !== parseInt(id_etab_formation)) {
        return res.status(403).json({ 
          message: 'Accès refusé: vous ne pouvez accéder qu\'aux données de votre établissement' 
        });
      }

      // Get stagiaires through their inscriptions to this establishment's offers
      const offres = await Offre.findAll({
        where: { id_etab_formation: parseInt(id_etab_formation) },
        attributes: ['id_offre']
      });

      const offreIds = offres.map(offre => offre.id_offre);

      if (offreIds.length === 0) {
        return res.json({
          stagiaires: [],
          total: 0,
          limit: parseInt(limit),
          offset: parseInt(offset)
        });
      }

      // Get inscriptions for these offers
      const inscriptions = await Inscription.findAll({
        where: { id_offre: { [Op.in]: offreIds } },
        attributes: ['id_stagiaire'],
        group: ['id_stagiaire']
      });

      const stagiaireIds = inscriptions.map(inscription => inscription.id_stagiaire);

      if (stagiaireIds.length === 0) {
        return res.json({
          stagiaires: [],
          total: 0,
          limit: parseInt(limit),
          offset: parseInt(offset)
        });
      }

      let whereClause = { id_stagiaire: { [Op.in]: stagiaireIds } };
      
      if (search) {
        whereClause = {
          ...whereClause,
          [Op.or]: [
            { nom_fr: { [Op.iLike]: `%${search}%` } },
            { prenom_fr: { [Op.iLike]: `%${search}%` } },
            { nom_ar: { [Op.iLike]: `%${search}%` } },
            { prenom_ar: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } }
          ]
        };
      }

      const stagiaires = await Stagiaire.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Compte,
            as: 'Compte',
            attributes: ['id_compte', 'username', 'role', 'createdAt']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['nom_fr', 'ASC'], ['prenom_fr', 'ASC']]
      });

      return res.json({
        stagiaires: stagiaires.rows,
        total: stagiaires.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

    } catch (error) {
      console.error('Error fetching stagiaires:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des stagiaires', 
        error: error.message 
      });
    }
  },

  // Create a new enseignant for the establishment
  async createEnseignant(req, res) {
    try {
      const { 
        username, 
        password, 
        nom_fr, 
        prenom_fr, 
        nom_ar, 
        prenom_ar, 
        email, 
        telephone, 
        date_naissance,
        id_grade 
      } = req.body;

      // Verify that the requesting user is from an establishment
      const etablissement = await EtablissementFormation.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissement) {
        return res.status(403).json({ 
          message: 'Accès refusé: seules les institutions peuvent créer des enseignants' 
        });
      }

      // Validate required fields
      if (!username || !password || !nom_fr || !prenom_fr) {
        return res.status(400).json({ 
          message: 'Les champs username, password, nom_fr et prenom_fr sont obligatoires' 
        });
      }

      // Check if username already exists
      const existingCompte = await Compte.findOne({ where: { username } });
      if (existingCompte) {
        return res.status(400).json({ 
          message: 'Ce nom d\'utilisateur existe déjà' 
        });
      }

      // Check if email already exists (if provided)
      if (email) {
        const existingEnseignant = await Enseignant.findOne({ where: { email } });
        if (existingEnseignant) {
          return res.status(400).json({ 
            message: 'Cet email est déjà utilisé' 
          });
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create account
      const compte = await Compte.create({
        username,
        password: hashedPassword,
        role: 'Enseignant'
      });

      // Create enseignant profile
      const enseignant = await Enseignant.create({
        nom_fr,
        prenom_fr,
        nom_ar,
        prenom_ar,
        email,
        telephone,
        date_naissance,
        id_grade: id_grade || null,
        id_etab_formation: etablissement.id_etab_formation,
        compte_id: compte.id_compte
      });

      // Return created enseignant with relations
      const createdEnseignant = await Enseignant.findByPk(enseignant.id_enseignant, {
        include: [
          {
            model: Grade,
            as: 'grade',
            attributes: ['id_grade', 'designation_fr', 'designation_ar', 'code_grade']
          },
          {
            model: Compte,
            as: 'Compte',
            attributes: ['id_compte', 'username', 'role', 'createdAt']
          }
        ]
      });

      return res.status(201).json({
        message: 'Enseignant créé avec succès',
        enseignant: createdEnseignant
      });

    } catch (error) {
      console.error('Error creating enseignant:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la création de l\'enseignant', 
        error: error.message 
      });
    }
  },

  // Create a new stagiaire for the establishment
  async createStagiaire(req, res) {
    try {
      const { 
        username, 
        password, 
        nom_fr, 
        prenom_fr, 
        nom_ar, 
        prenom_ar, 
        email, 
        telephone, 
        date_naissance 
      } = req.body;

      // Verify that the requesting user is from an establishment
      const etablissement = await EtablissementFormation.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissement) {
        return res.status(403).json({ 
          message: 'Accès refusé: seules les institutions peuvent créer des stagiaires' 
        });
      }

      // Validate required fields
      if (!username || !password || !nom_fr || !prenom_fr) {
        return res.status(400).json({ 
          message: 'Les champs username, password, nom_fr et prenom_fr sont obligatoires' 
        });
      }

      // Check if username already exists
      const existingCompte = await Compte.findOne({ where: { username } });
      if (existingCompte) {
        return res.status(400).json({ 
          message: 'Ce nom d\'utilisateur existe déjà' 
        });
      }

      // Check if email already exists (if provided)
      if (email) {
        const existingStagiaire = await Stagiaire.findOne({ where: { email } });
        if (existingStagiaire) {
          return res.status(400).json({ 
            message: 'Cet email est déjà utilisé' 
          });
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create account
      const compte = await Compte.create({
        username,
        password: hashedPassword,
        role: 'Stagiaire'
      });

      // Create stagiaire profile
      const stagiaire = await Stagiaire.create({
        nom_fr,
        prenom_fr,
        nom_ar,
        prenom_ar,
        email,
        telephone,
        date_naissance,
        compte_id: compte.id_compte
      });

      // Return created stagiaire with relations
      const createdStagiaire = await Stagiaire.findByPk(stagiaire.id_stagiaire, {
        include: [
          {
            model: Compte,
            as: 'Compte',
            attributes: ['id_compte', 'username', 'role', 'createdAt']
          }
        ]
      });

      return res.status(201).json({
        message: 'Stagiaire créé avec succès',
        stagiaire: createdStagiaire
      });

    } catch (error) {
      console.error('Error creating stagiaire:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la création du stagiaire', 
        error: error.message 
      });
    }
  },

  // Update an enseignant
  async updateEnseignant(req, res) {
    try {
      const { id_enseignant } = req.params;
      const updateData = req.body;

      // Verify that the requesting user is from an establishment
      const etablissement = await EtablissementFormation.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissement) {
        return res.status(403).json({ 
          message: 'Accès refusé: seules les institutions peuvent modifier des enseignants' 
        });
      }

      // Find the enseignant and verify it belongs to this establishment
      const enseignant = await Enseignant.findByPk(id_enseignant);
      if (!enseignant) {
        return res.status(404).json({ message: 'Enseignant introuvable' });
      }

      if (enseignant.id_etab_formation !== etablissement.id_etab_formation) {
        return res.status(403).json({ 
          message: 'Accès refusé: cet enseignant n\'appartient pas à votre établissement' 
        });
      }

      // Update enseignant data
      await enseignant.update(updateData);

      // Return updated enseignant with relations
      const updatedEnseignant = await Enseignant.findByPk(id_enseignant, {
        include: [
          {
            model: Grade,
            as: 'grade',
            attributes: ['id_grade', 'designation_fr', 'designation_ar', 'code_grade']
          },
          {
            model: Compte,
            as: 'compte',
            attributes: ['id_compte', 'username', 'role', 'createdAt']
          }
        ]
      });

      return res.json({
        message: 'Enseignant mis à jour avec succès',
        enseignant: updatedEnseignant
      });

    } catch (error) {
      console.error('Error updating enseignant:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la mise à jour de l\'enseignant', 
        error: error.message 
      });
    }
  },

  // Update a stagiaire
  async updateStagiaire(req, res) {
    try {
      const { id_stagiaire } = req.params;
      const updateData = req.body;

      // Verify that the requesting user is from an establishment
      const etablissement = await EtablissementFormation.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissement) {
        return res.status(403).json({ 
          message: 'Accès refusé: seules les institutions peuvent modifier des stagiaires' 
        });
      }

      // Find the stagiaire and verify it's accessible to this establishment
      const stagiaire = await Stagiaire.findByPk(id_stagiaire);
      if (!stagiaire) {
        return res.status(404).json({ message: 'Stagiaire introuvable' });
      }

      // Check if stagiaire is enrolled in any of this establishment's offers
      const inscriptions = await Inscription.findAll({
        include: [
          {
            model: Offre,
            as: 'offre',
            where: { id_etab_formation: etablissement.id_etab_formation }
          }
        ],
        where: { id_stagiaire: parseInt(id_stagiaire) }
      });

      if (inscriptions.length === 0) {
        return res.status(403).json({ 
          message: 'Accès refusé: ce stagiaire n\'est pas inscrit dans vos formations' 
        });
      }

      // Update stagiaire data
      await stagiaire.update(updateData);

      // Return updated stagiaire with relations
      const updatedStagiaire = await Stagiaire.findByPk(id_stagiaire, {
        include: [
          {
            model: Compte,
            as: 'compte',
            attributes: ['id_compte', 'username', 'role', 'createdAt']
          }
        ]
      });

      return res.json({
        message: 'Stagiaire mis à jour avec succès',
        stagiaire: updatedStagiaire
      });

    } catch (error) {
      console.error('Error updating stagiaire:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la mise à jour du stagiaire', 
        error: error.message 
      });
    }
  },

  // Get establishment statistics
  async getEtablissementStats(req, res) {
    try {
      // Verify that the requesting user is from an establishment
      const etablissement = await EtablissementFormation.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissement) {
        return res.status(403).json({ 
          message: 'Accès refusé: seules les institutions peuvent accéder aux statistiques' 
        });
      }

      const id_etab_formation = etablissement.id_etab_formation;

      // Get counts for various entities
      const [
        totalEnseignants,
        totalOffres,
        totalMemoires,
        totalInscriptions
      ] = await Promise.all([
        Enseignant.count({ where: { id_etab_formation } }),
        Offre.count({ where: { id_etab_formation } }),
        Memoire.count({
          include: [
            {
              model: Enseignant,
              as: 'enseignant',
              where: { id_etab_formation },
              required: true // Only count memoires that have an enseignant from this establishment
            }
          ]
        }),
        Inscription.count({
          include: [
            {
              model: Offre,
              as: 'offre',
              where: { id_etab_formation },
              required: true
            }
          ]
        })
      ]);

      // Get unique stagiaires count
      const uniqueStagiaires = await Inscription.findAll({
        include: [
          {
            model: Offre,
            as: 'offre',
            where: { id_etab_formation },
            attributes: []
          }
        ],
        attributes: ['id_stagiaire'],
        group: ['id_stagiaire']
      });

      const totalStagiaires = uniqueStagiaires.length;

      return res.json({
        etablissement: {
          id_etab_formation,
          nom_fr: etablissement.nom_fr,
          nom_ar: etablissement.nom_ar,
          code: etablissement.code
        },
        stats: {
          totalEnseignants,
          totalStagiaires,
          totalOffres,
          totalMemoires,
          totalInscriptions
        }
      });

    } catch (error) {
      console.error('Error fetching establishment stats:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des statistiques', 
        error: error.message 
      });
    }
  },

  // Get all inscriptions for the establishment's offers
  async getInscriptionsByEtablissement(req, res) {
    try {
      const { status, search, limit = 50, offset = 0 } = req.query;

      // Verify that the requesting user is from an establishment
      const etablissement = await EtablissementFormation.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissement) {
        return res.status(403).json({ 
          message: 'Accès refusé: seules les institutions peuvent accéder aux inscriptions' 
        });
      }

      // Get all offers for this establishment
      const offres = await Offre.findAll({
        where: { id_etab_formation: etablissement.id_etab_formation },
        attributes: ['id_offre']
      });

      const offreIds = offres.map(offre => offre.id_offre);

      if (offreIds.length === 0) {
        return res.json({
          inscriptions: [],
          total: 0,
          limit: parseInt(limit),
          offset: parseInt(offset)
        });
      }

      // Build where clause for inscriptions
      let whereClause = { id_offre: { [Op.in]: offreIds } };
      
      if (status && status !== 'all') {
        whereClause.statut = status;
      }

      // Build include clause for search
      let includeClause = [
        {
          model: Offre,
          as: 'offre',
          attributes: ['id_offre'],
          include: [
            {
              model: Specialite,
              as: 'specialite',
              attributes: ['designation_fr', 'designation_ar'],
              required: false
            },
            {
              model: Diplome,
              as: 'diplome',
              attributes: ['designation_fr', 'designation_ar'],
              required: false
            }
          ],
          required: false
        },
        {
          model: Stagiaire,
          as: 'stagiaire',
          attributes: ['id_stagiaire', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar', 'email'],
          include: [
            {
              model: Compte,
              as: 'Compte',
              attributes: ['username'],
              required: false
            }
          ],
          required: false
        }
      ];

      if (search) {
        includeClause[1].where = {
          [Op.or]: [
            { nom_fr: { [Op.iLike]: `%${search}%` } },
            { prenom_fr: { [Op.iLike]: `%${search}%` } },
            { nom_ar: { [Op.iLike]: `%${search}%` } },
            { prenom_ar: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } }
          ]
        };
      }

      const inscriptions = await Inscription.findAndCountAll({
        where: whereClause,
        include: includeClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return res.json({
        inscriptions: inscriptions.rows,
        total: inscriptions.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

    } catch (error) {
      console.error('Error fetching inscriptions:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des inscriptions', 
        error: error.message 
      });
    }
  },

  // Approve or reject an inscription
  async updateInscriptionStatus(req, res) {
    try {
      const { id_inscription } = req.params;
      const { statut, observation } = req.body;

      // Verify that the requesting user is from an establishment
      const etablissement = await EtablissementFormation.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissement) {
        return res.status(403).json({ 
          message: 'Accès refusé: seules les institutions peuvent modifier des inscriptions' 
        });
      }

      // Find the inscription and verify it belongs to this establishment
      const inscription = await Inscription.findByPk(id_inscription, {
        include: [
          {
            model: Offre,
            as: 'offre',
            where: { id_etab_formation: etablissement.id_etab_formation }
          }
        ]
      });

      if (!inscription) {
        return res.status(404).json({ 
          message: 'Inscription introuvable ou n\'appartient pas à votre établissement' 
        });
      }

      // Validate status
      const validStatuses = ['en_attente', 'acceptee', 'refusee', 'annulee'];
      if (!validStatuses.includes(statut)) {
        return res.status(400).json({ 
          message: 'Statut invalide. Valeurs acceptées: ' + validStatuses.join(', ') 
        });
      }

      // Update inscription
      await inscription.update({
        statut,
        observation: observation || null,
        date_decision: new Date()
      });

      // Return updated inscription with relations
      const updatedInscription = await Inscription.findByPk(id_inscription, {
        include: [
          {
            model: Offre,
            as: 'offre',
            attributes: ['id_offre']
          },
          {
            model: Stagiaire,
            as: 'stagiaire',
            attributes: ['id_stagiaire', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar', 'email']
          }
        ]
      });

      return res.json({
        message: 'Statut de l\'inscription mis à jour avec succès',
        inscription: updatedInscription
      });

    } catch (error) {
      console.error('Error updating inscription status:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la mise à jour du statut', 
        error: error.message 
      });
    }
  },

  // Bulk approve or reject inscriptions
  async bulkUpdateInscriptionsStatus(req, res) {
    try {
      const { inscription_ids, statut, observation } = req.body;

      // Verify that the requesting user is from an establishment
      const etablissement = await EtablissementFormation.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissement) {
        return res.status(403).json({ 
          message: 'Accès refusé: seules les institutions peuvent modifier des inscriptions' 
        });
      }

      if (!Array.isArray(inscription_ids) || inscription_ids.length === 0) {
        return res.status(400).json({ 
          message: 'Liste d\'identifiants d\'inscriptions requise' 
        });
      }

      // Validate status
      const validStatuses = ['en_attente', 'acceptee', 'refusee', 'annulee'];
      if (!validStatuses.includes(statut)) {
        return res.status(400).json({ 
          message: 'Statut invalide. Valeurs acceptées: ' + validStatuses.join(', ') 
        });
      }

      // Verify all inscriptions belong to this establishment
      const inscriptions = await Inscription.findAll({
        where: { id_inscription: { [Op.in]: inscription_ids } },
        include: [
          {
            model: Offre,
            as: 'offre',
            where: { id_etab_formation: etablissement.id_etab_formation }
          }
        ]
      });

      if (inscriptions.length !== inscription_ids.length) {
        return res.status(403).json({ 
          message: 'Certaines inscriptions n\'appartiennent pas à votre établissement' 
        });
      }

      // Update all inscriptions
      const updateResult = await Inscription.update(
        {
          statut,
          observation: observation || null,
          date_decision: new Date()
        },
        {
          where: { id_inscription: { [Op.in]: inscription_ids } }
        }
      );

      return res.json({
        message: `${updateResult[0]} inscriptions mises à jour avec succès`,
        updated_count: updateResult[0]
      });

    } catch (error) {
      console.error('Error bulk updating inscriptions:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la mise à jour en lot', 
        error: error.message 
      });
    }
  },

  // Get all memoires for the establishment (through enseignants)
  async getMemoiresByEtablissement(req, res) {
    try {
      const { search, limit = 50, offset = 0 } = req.query;

      // Verify that the requesting user is from an establishment
      const etablissement = await EtablissementFormation.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissement) {
        return res.status(403).json({ 
          message: 'Accès refusé: seules les institutions peuvent accéder aux mémoires' 
        });
      }

      // Get all enseignants for this establishment
      const enseignants = await Enseignant.findAll({
        where: { id_etab_formation: etablissement.id_etab_formation },
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

      // Simple query for memoires supervised by this establishment's enseignants
      let whereClause = {
        id_enseignant: { [Op.in]: enseignantIds }
      };

      // Build include clause
      let includeClause = [
        {
          model: Enseignant,
          as: 'enseignant',
          attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar'],
          required: false
        },
        {
          model: Stagiaire,
          as: 'stagiaire',
          attributes: ['id_stagiaire', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar'],
          required: false
        }
      ];

      if (search) {
        whereClause = {
          ...whereClause,
          [Op.or]: [
            { titre: { [Op.iLike]: `%${search}%` } },
            { '$enseignant.nom_fr$': { [Op.iLike]: `%${search}%` } },
            { '$enseignant.prenom_fr$': { [Op.iLike]: `%${search}%` } },
            { '$stagiaire.nom_fr$': { [Op.iLike]: `%${search}%` } },
            { '$stagiaire.prenom_fr$': { [Op.iLike]: `%${search}%` } }
          ]
        };
      }

      const memoires = await Memoire.findAndCountAll({
        where: whereClause,
        include: includeClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      return res.json({
        memoires: memoires.rows,
        total: memoires.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

    } catch (error) {
      console.error('Error fetching memoires:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des mémoires', 
        error: error.message 
      });
    }
  },

  // Assign memoire to enseignant
  async assignMemoireToEnseignant(req, res) {
    try {
      const { id_memoire } = req.params;
      const { id_enseignant } = req.body;

      // Verify that the requesting user is from an establishment
      const etablissement = await EtablissementFormation.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissement) {
        return res.status(403).json({ 
          message: 'Accès refusé: seules les institutions peuvent assigner des mémoires' 
        });
      }

      // Verify enseignant belongs to this establishment
      const enseignant = await Enseignant.findOne({
        where: { 
          id_enseignant: parseInt(id_enseignant),
          id_etab_formation: etablissement.id_etab_formation 
        }
      });

      if (!enseignant) {
        return res.status(403).json({ 
          message: 'Cet enseignant n\'appartient pas à votre établissement' 
        });
      }

      // Update memoire
      const memoire = await Memoire.findByPk(id_memoire);
      if (!memoire) {
        return res.status(404).json({ message: 'Mémoire introuvable' });
      }

      await memoire.update({ id_enseignant: parseInt(id_enseignant) });

      // Return updated memoire with relations
      const updatedMemoire = await Memoire.findByPk(id_memoire, {
        include: [
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar']
          },
          {
            model: Stagiaire,
            as: 'stagiaire',
            attributes: ['id_stagiaire', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar']
          }
        ]
      });

      return res.json({
        message: 'Mémoire assigné avec succès',
        memoire: updatedMemoire
      });

    } catch (error) {
      console.error('Error assigning memoire:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de l\'assignation du mémoire', 
        error: error.message 
      });
    }
  },

  // Update memoire status
  async updateMemoireStatusByEtablissement(req, res) {
    try {
      const { id_memoire } = req.params;
      const { statut } = req.body;

      // Verify that the requesting user is from an establishment
      const etablissement = await EtablissementFormation.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissement) {
        return res.status(403).json({ 
          message: 'Accès refusé: seules les institutions peuvent modifier le statut des mémoires' 
        });
      }

      // Validate status
      const validStatuses = ['en_preparation', 'en_attente', 'accepte', 'refuse', 'soutenu'];
      if (!validStatuses.includes(statut)) {
        return res.status(400).json({ 
          message: 'Statut invalide. Valeurs acceptées: ' + validStatuses.join(', ') 
        });
      }

      // Find and update memoire
      const memoire = await Memoire.findByPk(id_memoire);
      if (!memoire) {
        return res.status(404).json({ message: 'Mémoire introuvable' });
      }

      await memoire.update({ statut });

      // Return updated memoire
      const updatedMemoire = await Memoire.findByPk(id_memoire, {
        include: [
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar']
          },
          {
            model: Stagiaire,
            as: 'stagiaire',
            attributes: ['id_stagiaire', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar']
          }
        ]
      });

      return res.json({
        message: 'Statut du mémoire mis à jour avec succès',
        memoire: updatedMemoire
      });

    } catch (error) {
      console.error('Error updating memoire status:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la mise à jour du statut', 
        error: error.message 
      });
    }
  },

  // Get all existing enseignants (with or without accounts)
  async getAllExistingEnseignants(req, res) {
    try {
      const { search, limit = 50, offset = 0 } = req.query;

      // Verify that the requesting user is from an establishment
      const etablissement = await EtablissementFormation.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissement) {
        return res.status(403).json({ 
          message: 'Accès refusé: seules les institutions peuvent consulter les enseignants' 
        });
      }

      let whereClause = {};
      
      if (search) {
        whereClause = {
          [Op.or]: [
            { nom_fr: { [Op.iLike]: `%${search}%` } },
            { prenom_fr: { [Op.iLike]: `%${search}%` } },
            { nom_ar: { [Op.iLike]: `%${search}%` } },
            { prenom_ar: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } }
          ]
        };
      }

      const enseignants = await Enseignant.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Grade,
            as: 'grade',
            attributes: ['id_grade', 'designation_fr', 'designation_ar', 'code_grade'],
            required: false
          },
          {
            model: Compte,
            as: 'Compte',
            attributes: ['id_compte', 'username', 'role', 'createdAt'],
            required: false
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['nom_fr', 'ASC'], ['prenom_fr', 'ASC']]
      });

      return res.json({
        enseignants: enseignants.rows,
        total: enseignants.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

    } catch (error) {
      console.error('Error fetching all existing enseignants:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des enseignants', 
        error: error.message 
      });
    }
  },

  // Get all existing stagiaires (with or without accounts)
  async getAllExistingStagiaires(req, res) {
    try {
      const { search, limit = 50, offset = 0 } = req.query;

      // Verify that the requesting user is from an establishment
      const etablissement = await EtablissementFormation.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissement) {
        return res.status(403).json({ 
          message: 'Accès refusé: seules les institutions peuvent consulter les stagiaires' 
        });
      }

      let whereClause = {};
      
      if (search) {
        whereClause = {
          [Op.or]: [
            { nom_fr: { [Op.iLike]: `%${search}%` } },
            { prenom_fr: { [Op.iLike]: `%${search}%` } },
            { nom_ar: { [Op.iLike]: `%${search}%` } },
            { prenom_ar: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } }
          ]
        };
      }

      const stagiaires = await Stagiaire.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Compte,
            as: 'Compte',
            attributes: ['id_compte', 'username', 'role', 'createdAt'],
            required: false
          },
          {
            model: Inscription,
            as: 'inscriptions',
            include: [
              {
                model: Offre,
                as: 'offre',
                attributes: ['id_offre', 'date_debut', 'date_fin'], // Removed 'description' field which doesn't exist
                include: [
                  {
                    model: Specialite,
                    as: 'specialite',
                    attributes: ['designation_fr', 'designation_ar'],
                    required: false
                  },
                  {
                    model: EtablissementFormation,
                    as: 'etablissementFormation',
                    attributes: ['nom_fr', 'nom_ar'],
                    required: false
                  }
                ],
                required: false
              }
            ],
            required: false
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['nom_fr', 'ASC'], ['prenom_fr', 'ASC']]
      });

      return res.json({
        stagiaires: stagiaires.rows,
        total: stagiaires.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

    } catch (error) {
      console.error('Error fetching all existing stagiaires:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des stagiaires', 
        error: error.message 
      });
    }
  },

  // Create account for existing enseignant
  async createAccountForEnseignant(req, res) {
    try {
      const { id_enseignant } = req.params;
      const { username, password } = req.body;

      // Verify that the requesting user is from an establishment
      const etablissement = await EtablissementFormation.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissement) {
        return res.status(403).json({ 
          message: 'Accès refusé: seules les institutions peuvent créer des comptes' 
        });
      }

      // Validate required fields
      if (!username || !password) {
        return res.status(400).json({ 
          message: 'Les champs username et password sont obligatoires' 
        });
      }

      // Find the enseignant
      const enseignant = await Enseignant.findByPk(id_enseignant);
      if (!enseignant) {
        return res.status(404).json({ message: 'Enseignant introuvable' });
      }

      // Check if enseignant already has an account
      if (enseignant.compte_id) {
        return res.status(400).json({ 
          message: 'Cet enseignant a déjà un compte' 
        });
      }

      // Check if username already exists
      const existingCompte = await Compte.findOne({ where: { username } });
      if (existingCompte) {
        return res.status(400).json({ 
          message: 'Ce nom d\'utilisateur existe déjà' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create account
      const compte = await Compte.create({
        username,
        password: hashedPassword,
        role: 'Enseignant'
      });

      // Link account to enseignant
      await enseignant.update({ compte_id: compte.id_compte });

      // Return updated enseignant with account
      const updatedEnseignant = await Enseignant.findByPk(id_enseignant, {
        include: [
          {
            model: Grade,
            as: 'grade',
            attributes: ['id_grade', 'designation_fr', 'designation_ar', 'code_grade']
          },
          {
            model: Compte,
            as: 'Compte',
            attributes: ['id_compte', 'username', 'role', 'createdAt']
          }
        ]
      });

      return res.status(201).json({
        message: 'Compte créé avec succès pour l\'enseignant',
        enseignant: updatedEnseignant
      });

    } catch (error) {
      console.error('Error creating account for enseignant:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la création du compte', 
        error: error.message 
      });
    }
  },

  // Create account for existing stagiaire
  async createAccountForStagiaire(req, res) {
    try {
      const { id_stagiaire } = req.params;
      const { username, password } = req.body;

      // Verify that the requesting user is from an establishment
      const etablissement = await EtablissementFormation.findOne({ 
        where: { compte_id: req.user.id_compte } 
      });
      
      if (!etablissement) {
        return res.status(403).json({ 
          message: 'Accès refusé: seules les institutions peuvent créer des comptes' 
        });
      }

      // Validate required fields
      if (!username || !password) {
        return res.status(400).json({ 
          message: 'Les champs username et password sont obligatoires' 
        });
      }

      // Find the stagiaire
      const stagiaire = await Stagiaire.findByPk(id_stagiaire);
      if (!stagiaire) {
        return res.status(404).json({ message: 'Stagiaire introuvable' });
      }

      // Check if stagiaire already has an account
      if (stagiaire.compte_id) {
        return res.status(400).json({ 
          message: 'Ce stagiaire a déjà un compte' 
        });
      }

      // Check if username already exists
      const existingCompte = await Compte.findOne({ where: { username } });
      if (existingCompte) {
        return res.status(400).json({ 
          message: 'Ce nom d\'utilisateur existe déjà' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create account
      const compte = await Compte.create({
        username,
        password: hashedPassword,
        role: 'Stagiaire'
      });

      // Link account to stagiaire
      await stagiaire.update({ compte_id: compte.id_compte });

      // Return updated stagiaire with account
      const updatedStagiaire = await Stagiaire.findByPk(id_stagiaire, {
        include: [
          {
            model: Compte,
            as: 'Compte',
            attributes: ['id_compte', 'username', 'role', 'createdAt']
          }
        ]
      });

      return res.status(201).json({
        message: 'Compte créé avec succès pour le stagiaire',
        stagiaire: updatedStagiaire
      });

    } catch (error) {
      console.error('Error creating account for stagiaire:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la création du compte', 
        error: error.message 
      });
    }
  }
};

module.exports = EtablissementController;