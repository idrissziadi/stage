const Programme = require('../models/Programme');
const Module = require('../models/Module');
const EtablissementRegionale = require('../models/EtablissementRegionale');
const EnsModule = require('../models/Ens_Module');
const { Op } = require('sequelize');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

// Configuration multer pour l'upload des programmes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../upload/programmes');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Générer un nom unique pour le fichier
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'programme-' + uniqueSuffix + extension);
  }
});

const fileFilter = (req, file, cb) => {
  // Accepter uniquement les fichiers PDF
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PDF sont autorisés'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  }
});

const ProgrammeController = {
  // Get programme statistics
  async getProgrammeStats(req, res) {
    try {
      const total = await Programme.count();
      const valides = await Programme.count({ where: { status: 'مقبول' } });
      const en_attente = await Programme.count({ where: { status: 'في الانتظار' } });
      const refuses = await Programme.count({ where: { status: 'مرفوض' } });

      return res.json({
        total,
        valides,
        en_attente,
        refuses
      });
    } catch (error) {
      console.error('Error getting programme stats:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des statistiques des programmes', 
        error: error.message 
      });
    }
  },
  // Middleware pour l'upload
  uploadPDF: upload.single('fichierpdf'),

  // Récupérer tous les programmes
  async getAllProgrammes(req, res) {
    try {
      const programmes = await Programme.findAll({
        attributes: [
          'id_programme',
          'code_programme', 
          'titre_fr',
          'titre_ar',
          'status',
          'observation',
          'fichierpdf',
          'id_etab_regionale',
          'id_module',
          'createdAt',
          'updatedAt'
        ],
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module']
          },
          {
            model: EtablissementRegionale,
            as: 'etablissementRegionale',
            attributes: ['id_etab_regionale', 'nom_fr', 'nom_ar']
          }
        ],
        order: [['id_programme', 'DESC']]
      });

      return res.json(programmes);
    } catch (error) {
      console.error('Erreur getAllProgrammes:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer programmes par statut
  async getProgrammesByStatus(req, res) {
    try {
      const { status } = req.params;
      
      const programmes = await Programme.findAll({
        where: { status },
        attributes: [
          'id_programme',
          'code_programme', 
          'titre_fr',
          'titre_ar',
          'status',
          'observation',
          'fichierpdf',
          'id_etab_regionale',
          'id_module',
          'createdAt',
          'updatedAt'
        ],
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module']
          },
          {
            model: EtablissementRegionale,
            as: 'etablissementRegionale',
            attributes: ['id_etab_regionale', 'nom_fr', 'nom_ar']
          }
        ],
        order: [['id_programme', 'DESC']]
      });

      return res.json(programmes);
    } catch (error) {
      console.error('Erreur getProgrammesByStatus:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer programmes d'un établissement régional
  async getProgrammesByEtablissementRegional(req, res) {
    try {
      const { id_etab_regionale } = req.params;
      
      const programmes = await Programme.findAll({
        where: { id_etab_regionale },
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module']
          },
          {
            model: EtablissementRegionale,
            as: 'etablissementRegionale',
            attributes: ['id_etab_regionale', 'nom_fr', 'nom_ar']
          }
        ],
        order: [['id_programme', 'DESC']]
      });

      return res.json(programmes);
    } catch (error) {
      console.error('Erreur getProgrammesByEtablissementRegional:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer programmes pour un enseignant (programmes validés de ses modules)
  async getProgrammesByEnseignant(req, res) {
    try {
      const { id_enseignant } = req.params;
      
      // Récupérer les modules enseignés par cet enseignant
      const modulesEnseignes = await EnsModule.findAll({
        where: { id_enseignant },
        attributes: ['id_module']
      });

      const moduleIds = modulesEnseignes.map(em => em.id_module);

      if (moduleIds.length === 0) {
        return res.json([]);
      }

      // Récupérer les programmes validés pour ces modules
      const programmes = await Programme.findAll({
        where: { 
          id_module: { [Op.in]: moduleIds },
          status: 'مقبول'
        },
        attributes: [
          'id_programme',
          'code_programme', 
          'titre_fr',
          'titre_ar',
          'status',
          'observation',
          'fichierpdf',
          'id_etab_regionale',
          'id_module',
          'createdAt',
          'updatedAt'
        ],
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module'],
            include: [
              {
                model: require('../models/Specialite'),
                as: 'specialite',
                attributes: ['id_specialite', 'designation_fr', 'designation_ar', 'code_specialite']
              }
            ]
          },
          {
            model: EtablissementRegionale,
            as: 'etablissementRegionale',
            attributes: ['id_etab_regionale', 'nom_fr', 'nom_ar']
          }
        ],
        order: [['id_programme', 'DESC']]
      });

      return res.json(programmes);
    } catch (error) {
      console.error('Erreur getProgrammesByEnseignant:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Créer un nouveau programme (avec upload de fichier)
  async createProgramme(req, res) {
    try {
      const { 
        code_programme, 
        titre_fr, 
        titre_ar, 
        id_module, 
        observation 
      } = req.body;

      const { id_etab_regionale } = req.user; // De l'auth middleware

      // Vérifier si un fichier a été uploadé
      let fichierpdf = null;
      if (req.file) {
        fichierpdf = req.file.filename;
      }

      const programme = await Programme.create({
        code_programme,
        titre_fr,
        titre_ar,
        fichierpdf,
        status: 'في_الانتظار', // Statut initial
        observation,
        id_etab_regionale,
        id_module
      });

      // Récupérer le programme créé avec les associations
      const programmeComplet = await Programme.findByPk(programme.id_programme, {
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module'],
            include: [
              {
                model: require('../models/Specialite'),
                as: 'specialite',
                attributes: ['id_specialite', 'designation_fr', 'designation_ar', 'code_specialite']
              }
            ]
          },
          {
            model: EtablissementRegionale,
            as: 'etablissementRegionale',
            attributes: ['id_etab_regionale', 'nom_fr', 'nom_ar']
          }
        ]
      });

      return res.status(201).json({
        message: 'Programme créé avec succès',
        programme: programmeComplet
      });
    } catch (error) {
      console.error('Erreur createProgramme:', error);
      
      // Supprimer le fichier uploadé en cas d'erreur
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Erreur suppression fichier:', unlinkError);
        }
      }
      
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Mettre à jour un programme
  async updateProgramme(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Vérifier si un nouveau fichier a été uploadé
      if (req.file) {
        // Récupérer l'ancien fichier pour le supprimer
        const oldProgramme = await Programme.findByPk(id);
        if (oldProgramme && oldProgramme.fichierpdf) {
          const oldFilePath = path.join(__dirname, '../upload/programmes', oldProgramme.fichierpdf);
          try {
            await fs.unlink(oldFilePath);
          } catch (error) {
            console.error('Erreur suppression ancien fichier:', error);
          }
        }
        
        updateData.fichierpdf = req.file.filename;
      }

      const [updated] = await Programme.update(updateData, {
        where: { id_programme: id }
      });

      if (!updated) {
        return res.status(404).json({ message: 'Programme non trouvé' });
      }

      // Récupérer le programme mis à jour
      const programme = await Programme.findByPk(id, {
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module']
          },
          {
            model: EtablissementRegionale,
            as: 'etablissementRegionale',
            attributes: ['id_etab_regionale', 'nom_fr', 'nom_ar']
          }
        ]
      });

      return res.json({
        message: 'Programme mis à jour avec succès',
        programme
      });
    } catch (error) {
      console.error('Erreur updateProgramme:', error);
      
      // Supprimer le nouveau fichier en cas d'erreur
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Erreur suppression fichier:', unlinkError);
        }
      }
      
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Valider un programme (établissement nationale)
  async validateProgramme(req, res) {
    try {
      const { id } = req.params;
      const { observation } = req.body;

      const [updated] = await Programme.update({
        status: 'مقبول',
        observation: observation || ''
      }, {
        where: { id_programme: id }
      });

      if (!updated) {
        return res.status(404).json({ message: 'Programme non trouvé' });
      }

      return res.json({ message: 'Programme validé avec succès' });
    } catch (error) {
      console.error('Erreur validateProgramme:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Refuser un programme (établissement nationale)
  async rejectProgramme(req, res) {
    try {
      const { id } = req.params;
      const { observation } = req.body;

      const [updated] = await Programme.update({
        status: 'مرفوض',
        observation: observation || ''
      }, {
        where: { id_programme: id }
      });

      if (!updated) {
        return res.status(404).json({ message: 'Programme non trouvé' });
      }

      return res.json({ message: 'Programme refusé avec succès' });
    } catch (error) {
      console.error('Erreur rejectProgramme:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Supprimer un programme
  async deleteProgramme(req, res) {
    try {
      const { id } = req.params;

      // Récupérer le programme pour supprimer le fichier
      const programme = await Programme.findByPk(id);
      if (!programme) {
        return res.status(404).json({ message: 'Programme non trouvé' });
      }

      // Supprimer le fichier PDF s'il existe
      if (programme.fichierpdf) {
        const filePath = path.join(__dirname, '../upload/programmes', programme.fichierpdf);
        try {
          await fs.unlink(filePath);
        } catch (error) {
          console.error('Erreur suppression fichier:', error);
        }
      }

      // Supprimer le programme de la base de données
      await Programme.destroy({
        where: { id_programme: id }
      });

      return res.json({ message: 'Programme supprimé avec succès' });
    } catch (error) {
      console.error('Erreur deleteProgramme:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Servir un fichier PDF
  async servePDF(req, res) {
    try {
      const { filename } = req.params;
      const filePath = path.join(__dirname, '../upload/programmes', filename);

      // Vérifier si le fichier existe
      try {
        await fs.access(filePath);
      } catch (error) {
        return res.status(404).json({ message: 'Fichier non trouvé' });
      }

      // Définir les headers pour le PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.setHeader('Expires', '-1');
      res.setHeader('Pragma', 'no-cache');

      // Envoyer le fichier
      return res.sendFile(filePath);
    } catch (error) {
      console.error('Erreur servePDF:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer les statistiques des programmes
  async getProgrammeStats(req, res) {
    try {
      const stats = await Programme.findAll({
        attributes: [
          'status',
          [require('sequelize').fn('COUNT', require('sequelize').col('status')), 'count']
        ],
        group: 'status'
      });

      const formattedStats = {
        total: 0,
        parStatut: {
          'في_الانتظار': 0,
          'مقبول': 0,
          'مرفوض': 0
        }
      };

      stats.forEach(stat => {
        const count = parseInt(stat.dataValues.count);
        formattedStats.total += count;
        
        // Utiliser directement les status en arabe
        if (formattedStats.parStatut.hasOwnProperty(stat.status)) {
          formattedStats.parStatut[stat.status] = count;
        }
      });

      return res.json(formattedStats);
    } catch (error) {
      console.error('Erreur getProgrammeStats:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer le nombre d'institutions qui ont soumis des programmes
  async getInstitutionsWithProgrammesCount(req, res) {
    try {
      // Vérifier que l'utilisateur est de l'établissement nationale
      if (req.user.role !== 'EtablissementNationale') {
        return res.status(403).json({
          message: 'Accès refusé: seuls les établissements nationaux peuvent accéder à cette ressource'
        });
      }

      // Compter les établissements régionaux uniques qui ont soumis des programmes
      const institutionsWithProgrammes = await Programme.findAll({
        attributes: [
          'id_etab_regionale',
          [require('sequelize').fn('COUNT', require('sequelize').col('id_programme')), 'programmeCount']
        ],
        include: [
          {
            model: EtablissementRegionale,
            as: 'etablissementRegionale',
            attributes: ['nom_fr', 'nom_ar', 'code']
          }
        ],
        group: ['id_etab_regionale'],
        order: [[require('sequelize').fn('COUNT', require('sequelize').col('id_programme')), 'DESC']]
      });

      // Compter le nombre total d'institutions uniques
      const totalInstitutions = institutionsWithProgrammes.length;

      // Calculer les statistiques par statut
      const statsByStatus = await Programme.findAll({
        attributes: [
          'id_etab_regionale',
          'status',
          [require('sequelize').fn('COUNT', require('sequelize').col('id_programme')), 'count']
        ],
        group: ['id_etab_regionale', 'status']
      });

      // Organiser les statistiques par institution
      const institutionsStats = {};
      statsByStatus.forEach(stat => {
        const etabId = stat.id_etab_regionale;
        const status = stat.status;
        const count = parseInt(stat.dataValues.count);
        
        if (!institutionsStats[etabId]) {
          institutionsStats[etabId] = {
            total: 0,
            parStatut: {
              'في_الانتظار': 0,
              'مقبول': 0,
              'مرفوض': 0
            }
          };
        }
        
        institutionsStats[etabId].total += count;
        if (institutionsStats[etabId].parStatut.hasOwnProperty(status)) {
          institutionsStats[etabId].parStatut[status] = count;
        }
      });

      // Enrichir les données avec les statistiques
      const enrichedData = institutionsWithProgrammes.map(inst => {
        const etabId = inst.id_etab_regionale;
        const stats = institutionsStats[etabId] || { total: 0, parStatut: { 'في_الانتظار': 0, 'مقبول': 0, 'مرفوض': 0 } };
        
        return {
          id_etab_regionale: etabId,
          nom_fr: inst.etablissementRegionale?.nom_fr,
          nom_ar: inst.etablissementRegionale?.nom_ar,
          code: inst.etablissementRegionale?.code,
          totalProgrammes: stats.total,
          programmesEnAttente: stats.parStatut['في_الانتظار'],
          programmesValides: stats.parStatut['مقبول'],
          programmesRefuses: stats.parStatut['مرفوض']
        };
      });

      return res.json({
        message: 'Statistiques des institutions avec programmes récupérées avec succès',
        totalInstitutions,
        institutions: enrichedData
      });

    } catch (error) {
      console.error('Erreur getInstitutionsWithProgrammesCount:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer les activités récentes
  async getRecentActivities(req, res) {
    try {
      const programmes = await Programme.findAll({
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['designation_fr', 'designation_ar']
          },
          {
            model: EtablissementRegionale,
            as: 'etablissementRegionale',
            attributes: ['nom_fr', 'nom_ar']
          }
        ],
        order: [['updatedAt', 'DESC']],
        limit: 10
      });

      return res.json(programmes);
    } catch (error) {
      console.error('Erreur getRecentActivities:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = ProgrammeController;