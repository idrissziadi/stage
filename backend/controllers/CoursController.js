const Cours = require('../models/Cours');
const Module = require('../models/Module');
const Enseignant = require('../models/Enseignant');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

const CoursController = {
  // Get cours statistics
  async getCoursStats(req, res) {
    try {
      const total = await Cours.count();
      const valides = await Cours.count({ where: { status: 'مقبول' } });
      const en_attente = await Cours.count({ where: { status: 'في الانتظار' } });
      const refuses = await Cours.count({ where: { status: 'مرفوض' } });

      return res.json({
        total,
        valides,
        en_attente,
        refuses
      });
    } catch (error) {
      console.error('Error getting cours stats:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des statistiques des cours', 
        error: error.message 
      });
    }
  },
  // Récupérer tous les cours (pour les stagiaires)
  async getAllCours(req, res) {
    try {
      const cours = await Cours.findAll({
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['id_module', 'code_module', 'designation_fr', 'designation_ar']
          },
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar']
          }
        ]
        // Supprimé le filtre de statut pour récupérer tous les cours
      });

      return res.json(cours || []);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer tous les cours selon les modules disponibles (pour établissement régional)
  async getAllCoursByModules(req, res) {
    try {
      const { status = 'all', search = '', limit = 1000, offset = 0 } = req.query;

      // Build where clause
      let whereClause = {};
      
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
            { titre_ar: { [Op.iLike]: `%${search}%` } },
            { code_cours: { [Op.iLike]: `%${search}%` } }
          ]
        };
      }

      const cours = await Cours.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['id_module', 'code_module', 'designation_fr', 'designation_ar']
          },
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      return res.json({
        cours: cours.rows,
        total: cours.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      console.error('Error getting cours by modules:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer tous les cours avec tous les statuts (pour établissement régional)
  async getAllCoursWithAllStatus(req, res) {
    try {
      const cours = await Cours.findAll({
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['id_module', 'code_module', 'designation_fr', 'designation_ar']
          },
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return res.json(cours || []);
    } catch (error) {
      console.error('Error getting all cours with all status:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer les cours d'un enseignant
  async getCoursByEnseignant(req, res) {
    try {
      const { id_enseignant } = req.params;
      
      const cours = await Cours.findAll({
        where: { id_enseignant },
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['designation_fr', 'designation_ar']
          }
        ]
      });

      return res.json(cours);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Créer un nouveau cours
  async createCours(req, res) {
    try {
      const { id_compte } = req.user;
      
      // Find the enseignant record to get id_enseignant
      const enseignant = await Enseignant.findOne({ where: { compte_id: id_compte } });
      if (!enseignant) {
        return res.status(404).json({ message: 'Profil enseignant introuvable' });
      }
      
      const coursData = { ...req.body, id_enseignant: enseignant.id_enseignant };
      
      const cours = await Cours.create(coursData);
      return res.status(201).json(cours);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Créer un nouveau cours avec upload de fichier PDF
  async createCoursWithFile(req, res) {
    try {
      const { id_compte } = req.user;
      
      console.log('Creating course with data:', req.body);
      console.log('File info:', req.file);
      console.log('User from token:', req.user);
      
      // Find the enseignant record to get id_enseignant
      const enseignant = await Enseignant.findOne({ where: { compte_id: id_compte } });
      if (!enseignant) {
        return res.status(404).json({ message: 'Profil enseignant introuvable' });
      }
      
      console.log('Found enseignant:', enseignant.id_enseignant);
      
      // Vérifier si un fichier a été uploadé
      if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier PDF fourni' });
      }

      // Préparer les données du cours
      const coursData = {
        code_cours: req.body.code_cours,
        titre_fr: req.body.titre_fr,
        titre_ar: req.body.titre_ar,
        id_module: parseInt(req.body.id_module),
        id_enseignant: enseignant.id_enseignant,
        fichierpdf: req.file.path, // Chemin du fichier uploadé
        status: 'في_الانتظار', // Statut par défaut
        observation: req.body.observation || null // Optionnel
      };

      console.log('Course data to create:', coursData);

      // Créer le cours
      const cours = await Cours.create(coursData);

      // Récupérer le cours avec les relations
      const coursWithRelations = await Cours.findByPk(cours.id_cours, {
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['designation_fr', 'designation_ar', 'code_module']
          }
        ]
      });

      return res.status(201).json({
        message: 'Cours créé avec succès',
        cours: coursWithRelations
      });
    } catch (error) {
      console.error('Error creating course:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur', 
        error: error.message,
        details: error.errors ? error.errors.map(e => e.message) : null
      });
    }
  },

  // Mettre à jour un cours
  async updateCours(req, res) {
    try {
      const { id_cours } = req.params;
      const { id_compte } = req.user;
      
      // Find the enseignant record to get id_enseignant
      const enseignant = await Enseignant.findOne({ where: { compte_id: id_compte } });
      if (!enseignant) {
        return res.status(404).json({ message: 'Profil enseignant introuvable' });
      }
      
      const cours = await Cours.findOne({ where: { id_cours, id_enseignant: enseignant.id_enseignant } });
      if (!cours) {
        return res.status(404).json({ message: 'Cours introuvable' });
      }

      await cours.update(req.body);
      return res.json(cours);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Supprimer un cours
  async deleteCours(req, res) {
    try {
      const { id_cours } = req.params;
      const { id_compte } = req.user;
      
      // Find the enseignant record to get id_enseignant
      const enseignant = await Enseignant.findOne({ where: { compte_id: id_compte } });
      if (!enseignant) {
        return res.status(404).json({ message: 'Profil enseignant introuvable' });
      }
      
      const cours = await Cours.findOne({ where: { id_cours, id_enseignant: enseignant.id_enseignant } });
      if (!cours) {
        return res.status(404).json({ message: 'Cours introuvable' });
      }

      await cours.destroy();
      return res.json({ message: 'Cours supprimé avec succès' });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer les cours en attente d'un enseignant
  async getCoursEnAttenteByEnseignant(req, res) {
    try {
      const { id_enseignant } = req.params;
      
      const cours = await Cours.findAll({
        where: { 
          id_enseignant,
          status: 'في_الانتظار'
        },
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['designation_fr', 'designation_ar', 'code_module']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return res.json(cours);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer les cours approuvés pour les modules enseignés par un enseignant
  async getCoursApprouvesByEnseignant(req, res) {
    try {
      const { id_compte } = req.user;
      
      // Find the enseignant record to get id_enseignant and etablissement
      const enseignant = await Enseignant.findOne({ 
        where: { compte_id: id_compte },
        include: [{
          model: require('../models/EtablissementFormation'),
          as: 'etablissementFormation',
          attributes: ['id_etab_formation']
        }]
      });
      
      if (!enseignant) {
        return res.status(404).json({ message: 'Profil enseignant introuvable' });
      }

      // D'abord, récupérer les modules enseignés par cet enseignant
      const EnsModule = require('../models/Ens_Module');
      const modulesEnseignes = await EnsModule.findAll({
        where: { id_enseignant: enseignant.id_enseignant },
        attributes: ['id_module']
      });

      const moduleIds = modulesEnseignes.map(em => em.id_module);

      if (moduleIds.length === 0) {
        return res.json([]);
      }

      // Récupérer tous les enseignants du même établissement
      const enseignantsMemeEtablissement = await Enseignant.findAll({
        where: { id_etab_formation: enseignant.etablissementFormation.id_etab_formation },
        attributes: ['id_enseignant']
      });

      const enseignantIds = enseignantsMemeEtablissement.map(ens => ens.id_enseignant);

      // Récupérer les cours approuvés pour ces modules, mais seulement des enseignants du même établissement
      const cours = await Cours.findAll({
        where: { 
          id_module: { [Op.in]: moduleIds },
          id_enseignant: { [Op.in]: enseignantIds },
          status: 'مقبول'
        },
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['designation_fr', 'designation_ar', 'code_module'],
            include: [{
              model: require('../models/Specialite'),
              as: 'specialite',
              attributes: ['designation_fr', 'designation_ar']
            }]
          },
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'email'],
            include: [{
              model: require('../models/Grade'),
              as: 'grade',
              attributes: ['designation_fr', 'designation_ar']
            }, {
              model: require('../models/EtablissementFormation'),
              as: 'etablissementFormation',
              attributes: ['nom_fr', 'nom_ar']
            }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return res.json(cours);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Exporter un cours (changer le statut vers "في_الانتظار")
  async exporterCours(req, res) {
    try {
      const { id_cours } = req.params;
      const { id_compte } = req.user;
      
      // Find the enseignant record to get id_enseignant
      const enseignant = await Enseignant.findOne({ where: { compte_id: id_compte } });
      if (!enseignant) {
        return res.status(404).json({ message: 'Profil enseignant introuvable' });
      }
      
      const cours = await Cours.findOne({ where: { id_cours, id_enseignant: enseignant.id_enseignant } });
      if (!cours) {
        return res.status(404).json({ message: 'Cours introuvable' });
      }

      // Vérifier que le cours n'est pas déjà exporté
      if (cours.status === 'في_الانتظار') {
        return res.status(400).json({ message: 'Ce cours est déjà en attente d\'approbation' });
      }

      await cours.update({ status: 'في_الانتظار' });
      return res.json({ 
        message: 'Cours exporté avec succès',
        cours: {
          ...cours.toJSON(),
          module: await cours.getModule()
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer les cours approuvés pour les spécialités d'un stagiaire
  async getCoursByStagiaire(req, res) {
    try {
      const { id_compte } = req.user;
      
      // Find the stagiaire record to get id_stagiaire and etablissement
      const Stagiaire = require('../models/Stagiaire');
      const stagiaire = await Stagiaire.findOne({ where: { compte_id: id_compte } });
      
      if (!stagiaire) {
        return res.status(404).json({ message: 'Profil stagiaire introuvable' });
      }
      
      console.log('Fetching courses for stagiaire:', stagiaire.id_stagiaire);
      
      // Récupérer les inscriptions du stagiaire avec les offres et spécialités
      const Inscription = require('../models/Inscription');
      const Offre = require('../models/Offre');
      const Specialite = require('../models/Specialite');
      
      const inscriptions = await Inscription.findAll({
        where: { id_stagiaire: stagiaire.id_stagiaire },
        include: [
          {
            model: Offre,
            as: 'offre',
            include: [
              {
                model: Specialite,
                as: 'specialite',
                attributes: ['id_specialite', 'designation_fr', 'designation_ar'],
                required: false
              },
              {
                model: require('../models/EtablissementFormation'),
                as: 'etablissementFormation',
                attributes: ['id_etab_formation']
              }
            ],
            required: false
          }
        ]
      });

      console.log('Found inscriptions:', inscriptions.length);

      // Extraire les IDs des spécialités et établissements
      const specialiteIds = inscriptions
        .filter(inscription => inscription.offre && inscription.offre.specialite)
        .map(inscription => inscription.offre.specialite.id_specialite)
        .filter((id, index, self) => self.indexOf(id) === index);

      const etablissementIds = inscriptions
        .filter(inscription => inscription.offre && inscription.offre.etablissementFormation)
        .map(inscription => inscription.offre.etablissementFormation.id_etab_formation)
        .filter((id, index, self) => self.indexOf(id) === index);

      console.log('Found specialite IDs:', specialiteIds);
      console.log('Found etablissement IDs:', etablissementIds);

      if (specialiteIds.length === 0 || etablissementIds.length === 0) {
        console.log('No specialites or etablissements found for stagiaire');
        return res.json([]);
      }

      // Récupérer les modules de ces spécialités
      const modules = await Module.findAll({
        where: { 
          id_specialite: { [Op.in]: specialiteIds }
        },
        attributes: ['id_module']
      });

      const moduleIds = modules.map(module => module.id_module);
      console.log('Found module IDs:', moduleIds);

      if (moduleIds.length === 0) {
        console.log('No modules found for specialites');
        return res.json([]);
      }

      // Récupérer les enseignants des établissements du stagiaire
      const enseignants = await Enseignant.findAll({
        where: { id_etab_formation: { [Op.in]: etablissementIds } },
        attributes: ['id_enseignant']
      });

      const enseignantIds = enseignants.map(ens => ens.id_enseignant);

      if (enseignantIds.length === 0) {
        console.log('No enseignants found for etablissements');
        return res.json([]);
      }

      // Récupérer les cours approuvés pour ces modules, mais seulement des enseignants du même établissement
      const cours = await Cours.findAll({
        where: { 
          id_module: { [Op.in]: moduleIds },
          id_enseignant: { [Op.in]: enseignantIds },
          status: 'مقبول'
        },
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module'],
            include: [
              {
                model: Specialite,
                as: 'specialite',
                attributes: ['designation_fr', 'designation_ar'],
                required: false
              }
            ],
            required: false
          },
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'email'],
            include: [{
              model: require('../models/Grade'),
              as: 'grade',
              attributes: ['designation_fr', 'designation_ar']
            }, {
              model: require('../models/EtablissementFormation'),
              as: 'etablissementFormation',
              attributes: ['nom_fr', 'nom_ar']
            }],
            required: false
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      console.log('Found courses:', cours.length);
      return res.json(cours);
    } catch (error) {
      console.error('Error in getCoursByStagiaire:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer un cours par ID avec ses détails
  async getCoursById(req, res) {
    try {
      const { id_cours } = req.params;
      
      const cours = await Cours.findByPk(id_cours, {
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['designation_fr', 'designation_ar', 'code_module']
          },
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['nom_fr', 'prenom_fr']
          }
        ]
      });

      if (!cours) {
        return res.status(404).json({ message: 'Cours introuvable' });
      }

      return res.json(cours);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Mettre à jour le statut d'un cours (pour établissement régionale)
  async updateCoursStatus(req, res) {
    try {
      const { id_cours } = req.params;
      const { status, observation } = req.body;
      const { id_etab_regionale } = req.user;

      // Vérifier que le cours appartient à un enseignant de l'établissement régionale
      const cours = await Cours.findOne({
        where: { id_cours },
        include: [
          {
            model: Enseignant,
            as: 'enseignant',
            include: [
              {
                model: require('../models/EtablissementFormation'),
                as: 'etablissementFormation',
                where: { id_etab_regionale }
              }
            ]
          }
        ]
      });

      if (!cours) {
        return res.status(404).json({ message: 'Cours non trouvé ou non autorisé' });
      }

      // Mettre à jour le statut et l'observation
      await cours.update({
        status: status,
        observation: observation || cours.observation
      });

      return res.json({ 
        message: 'Statut du cours mis à jour avec succès',
        cours: cours
      });
    } catch (error) {
      console.error('Erreur updateCoursStatus:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Mettre à jour un cours (pour établissement régionale)
  async updateCoursRegional(req, res) {
    try {
      const { id_cours } = req.params;
      const { observation, status } = req.body;
      const { id_etab_regionale } = req.user;

      console.log('🔍 updateCoursRegional - Debug Info:');
      console.log('  - id_cours:', id_cours);
      console.log('  - observation:', observation);
      console.log('  - status:', status);
      console.log('  - id_etab_regionale:', id_etab_regionale);
      console.log('  - req.user:', req.user);

      if (!id_etab_regionale) {
        console.log('❌ Pas d\'ID établissement régional dans le token');
        return res.status(403).json({ message: 'Accès refusé - ID établissement régional requis' });
      }

      // Vérifier que le cours existe et appartient à un établissement de cette région
      // Utiliser la relation correcte : Cours -> Module -> Specialite -> Branche -> EtablissementRegionale
      console.log('🔍 Recherche du cours avec les relations...');
      const cours = await Cours.findOne({
        where: { id_cours },
        include: [
          {
            model: require('../models/Module'),
            as: 'module',
            include: [
              {
                model: require('../models/Specialite'),
                as: 'specialite',
                include: [
                  {
                    model: require('../models/Branche'),
                    as: 'branche',
                    where: { id_etab_regionale }
                  }
                ]
              }
            ]
          }
        ]
      });

      console.log('🔍 Résultat de la recherche:', cours ? 'Cours trouvé' : 'Cours non trouvé');

      if (!cours) {
        console.log('❌ Cours non trouvé ou non autorisé pour cette région');
        return res.status(404).json({ message: 'Cours non trouvé ou non autorisé pour cette région' });
      }

      // Préparer les données de mise à jour
      const updateData = {};
      if (observation !== undefined) updateData.observation = observation;
      if (status !== undefined) updateData.status = status;
      updateData.updated_at = new Date();

      console.log('🔍 Données de mise à jour:', updateData);

      // Mettre à jour le cours
      await cours.update(updateData);
      console.log('✅ Cours mis à jour avec succès');

      return res.json({ 
        message: 'Cours mis à jour avec succès',
        cours: cours
      });
    } catch (error) {
      console.error('❌ Erreur updateCoursRegional:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Servir un fichier PDF de cours
  async servePDF(req, res) {
    try {
      const { filename } = req.params;
      
      if (!filename) {
        return res.status(400).json({ message: 'Nom de fichier requis' });
      }

      const filePath = path.join(__dirname, '../upload/cours', filename);
      
      // Vérifier que le fichier existe
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Fichier non trouvé' });
      }

      // Vérifier que l'utilisateur a accès au cours
      const cours = await Cours.findOne({
        where: { fichierpdf: filename },
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['designation_fr', 'designation_ar']
          },
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['nom_fr', 'prenom_fr']
          }
        ]
      });

      if (!cours) {
        return res.status(404).json({ message: 'Cours non trouvé' });
      }

      // Vérifier les permissions selon le rôle de l'utilisateur
      const userRole = req.user.role;
      
      if (userRole === 'Enseignant') {
        // Les enseignants peuvent voir tous les cours approuvés
        if (cours.status !== 'مقبول') {
          return res.status(403).json({ message: 'Accès refusé - Cours non approuvé' });
        }
      } else if (userRole === 'Stagiaire') {
        // Les stagiaires peuvent voir les cours approuvés de leurs spécialités
        if (cours.status !== 'مقبول') {
          return res.status(403).json({ message: 'Accès refusé - Cours non approuvé' });
        }
      }
      // Les autres rôles (EtablissementNationale, EtablissementRegionale) ont accès complet

      // Servir le fichier PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.setHeader('Expires', '-1');
      res.setHeader('Pragma', 'no-cache');
      
      res.sendFile(filePath);
    } catch (error) {
      console.error('Erreur servePDF cours:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = CoursController;
