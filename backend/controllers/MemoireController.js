const Memoire = require('../models/Memoire');
const Stagiaire = require('../models/Stagiaire');
const Enseignant = require('../models/Enseignant');
const Inscription = require('../models/Inscription');
const EtablissementFormation = require('../models/EtablissementFormation');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

const MemoireController = {
  // Récupérer tous les mémoires d'un stagiaire
  async getMemoiresByStagiaire(req, res) {
    try {
      const { id_stagiaire } = req.params;
      console.log('Fetching memoires for stagiaire:', id_stagiaire);
      
      const memoires = await Memoire.findAll({
        where: { id_stagiaire },
        include: [
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['nom_fr', 'prenom_fr'],
            required: false // Left join to handle null enseignant
          }
        ]
      });

      console.log('Found memoires:', memoires.length);
      return res.json(memoires);
    } catch (error) {
      console.error('Error in getMemoiresByStagiaire:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer tous les mémoires encadrés par un enseignant
  async getMemoiresByEnseignant(req, res) {
    try {
      const { id_enseignant } = req.params;
      
      const memoires = await Memoire.findAll({
        where: { id_enseignant },
        include: [
          {
            model: Stagiaire,
            as: 'stagiaire',
            attributes: ['nom_fr', 'prenom_fr']
          }
        ]
      });

      return res.json(memoires);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer les mémoires validés d'une offre de formation (pour stagiaires)
  async getMemoiresByOffre(req, res) {
    try {
      const { id_offre } = req.params;
      
      // Récupérer tous les stagiaires inscrits à cette offre
      const inscriptions = await Inscription.findAll({
        where: { id_offre },
        attributes: ['id_stagiaire']
      });

      const stagiaireIds = inscriptions.map(inscription => inscription.id_stagiaire);

      if (stagiaireIds.length === 0) {
        return res.json([]);
      }

      // Récupérer les mémoires validés de ces stagiaires
      const memoires = await Memoire.findAll({
        where: { 
          id_stagiaire: { [Op.in]: stagiaireIds },
          status: 'مقبول' // Seulement les mémoires validés
        },
        include: [
          {
            model: Stagiaire,
            as: 'stagiaire',
            attributes: ['nom_fr', 'prenom_fr']
          },
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['nom_fr', 'prenom_fr']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return res.json(memoires);
    } catch (error) {
      console.error('Error in getMemoiresByOffre:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer les mémoires collaboratifs pour un stagiaire (basé sur son offre)
  async getMemoiresCollaboratifsByStagiaire(req, res) {
    try {
      const { id_stagiaire } = req.params;
      console.log('Fetching collaborative memoires for stagiaire:', id_stagiaire);
      
      // Récupérer les offres du stagiaire
      const inscriptions = await Inscription.findAll({
        where: { id_stagiaire },
        attributes: ['id_offre']
      });

      console.log('Found inscriptions:', inscriptions.length);
      const offreIds = inscriptions.map(inscription => inscription.id_offre);

      if (offreIds.length === 0) {
        console.log('No inscriptions found for stagiaire:', id_stagiaire);
        return res.json([]);
      }

      // Récupérer tous les stagiaires de ces offres (sauf le stagiaire actuel)
      const autresInscriptions = await Inscription.findAll({
        where: { 
          id_offre: { [Op.in]: offreIds },
          id_stagiaire: { [Op.ne]: id_stagiaire }
        },
        attributes: ['id_stagiaire']
      });

      const autreStagiaireIds = autresInscriptions.map(inscription => inscription.id_stagiaire)
        .filter((id, index, self) => self.indexOf(id) === index); // Remove duplicates

      console.log('Found other stagiaires:', autreStagiaireIds.length);

      if (autreStagiaireIds.length === 0) {
        console.log('No other stagiaires found in same offers');
        return res.json([]);
      }

      // Récupérer les mémoires validés de ces autres stagiaires
      const memoires = await Memoire.findAll({
        where: { 
          id_stagiaire: { [Op.in]: autreStagiaireIds },
          status: 'مقبول'
        },
        include: [
          {
            model: Stagiaire,
            as: 'stagiaire',
            attributes: ['nom_fr', 'prenom_fr']
          },
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['nom_fr', 'prenom_fr']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      console.log('Found collaborative memoires:', memoires.length);
      return res.json(memoires);
    } catch (error) {
      console.error('Error in getMemoiresCollaboratifsByStagiaire:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Créer un nouveau mémoire
  async createMemoire(req, res) {
    try {
      const memoire = await Memoire.create(req.body);
      return res.status(201).json(memoire);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Mettre à jour un mémoire
  async updateMemoire(req, res) {
    try {
      const { id_memoire } = req.params;
      
      const memoire = await Memoire.findByPk(id_memoire);
      if (!memoire) {
        return res.status(404).json({ message: 'Mémoire introuvable' });
      }

      await memoire.update(req.body);
      return res.json(memoire);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Mettre à jour un mémoire avec fichier PDF
  async updateMemoireWithFile(req, res) {
    try {
      const { id_memoire } = req.params;
      
      const memoire = await Memoire.findByPk(id_memoire);
      if (!memoire) {
        return res.status(404).json({ message: 'Mémoire introuvable' });
      }

      // Préparer les données de mise à jour
      const updateData = {
        titre_fr: req.body.titre_fr || memoire.titre_fr,
        titre_ar: req.body.titre_ar || memoire.titre_ar,
        observation: req.body.observation || memoire.observation
      };

      // Si un fichier a été uploadé, mettre à jour le chemin
      if (req.file) {
        updateData.fichierpdf = req.file.path;
      }

      await memoire.update(updateData);
      
      // Récupérer le mémoire avec les relations
      const memoireWithRelations = await Memoire.findByPk(id_memoire, {
        include: [
          {
            model: Stagiaire,
            as: 'stagiaire',
            attributes: ['nom_fr', 'prenom_fr']
          },
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['nom_fr', 'prenom_fr']
          }
        ]
      });

      return res.json(memoireWithRelations);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Supprimer un mémoire
  async deleteMemoire(req, res) {
    try {
      const { id_memoire } = req.params;
      
      const memoire = await Memoire.findByPk(id_memoire);
      if (!memoire) {
        return res.status(404).json({ message: 'Mémoire introuvable' });
      }

      await memoire.destroy();
      return res.json({ message: 'Mémoire supprimé avec succès' });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // ==============================================
  // DETAILED MEMOIRE MANAGEMENT WORKFLOW METHODS
  // ==============================================

  // 1. ESTABLISHMENT: Assign stagiaire to enseignant (creates memoire with status 'مقدم')
  async assignStagiaireToEnseignant(req, res) {
    try {
      const { id_stagiaire, id_enseignant } = req.body;
      
      if (!id_stagiaire || !id_enseignant) {
        return res.status(400).json({ 
          message: 'id_stagiaire et id_enseignant sont requis' 
        });
      }

      // Vérifier si le stagiaire a déjà un mémoire
      const existingMemoire = await Memoire.findOne({
        where: { id_stagiaire }
      });

      if (existingMemoire) {
        return res.status(400).json({ 
          message: 'Ce stagiaire a déjà un mémoire assigné' 
        });
      }

      // Créer le mémoire avec status 'مقدم'
      const memoire = await Memoire.create({
        id_stagiaire,
        id_enseignant,
        status: 'مقدم',
        titre_fr: null,
        titre_ar: null,
        fichierpdf: null,
        observation: null
      });

      // Récupérer le mémoire avec les relations
      const memoireWithRelations = await Memoire.findByPk(memoire.id_memoire, {
        include: [
          {
            model: Stagiaire,
            as: 'stagiaire',
            attributes: ['id_stagiaire', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar']
          },
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar']
          }
        ]
      });

      return res.status(201).json({
        message: 'Mémoire assigné avec succès',
        memoire: memoireWithRelations
      });
    } catch (error) {
      console.error('Error in assignStagiaireToEnseignant:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de l\'assignation', 
        error: error.message 
      });
    }
  },

  // 2. STAGIAIRE: Get their memoire
  async getMemoireByStagiaire(req, res) {
    try {
      const { id_stagiaire } = req.params;
      
      const memoire = await Memoire.findOne({
        where: { id_stagiaire },
        include: [
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar']
          }
        ]
      });

      if (!memoire) {
        return res.status(404).json({ 
          message: 'Aucun mémoire assigné pour ce stagiaire' 
        });
      }

      return res.json(memoire);
    } catch (error) {
      console.error('Error in getMemoireByStagiaire:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération du mémoire', 
        error: error.message 
      });
    }
  },

  // 3. STAGIAIRE: Update their memoire (titre_ar, titre_fr, fichierpdf)
  async updateMemoireByStagiaire(req, res) {
    try {
      const { id_stagiaire } = req.params;
      const { titre_fr, titre_ar } = req.body;
      
      const memoire = await Memoire.findOne({
        where: { id_stagiaire }
      });

      if (!memoire) {
        return res.status(404).json({ 
          message: 'Aucun mémoire assigné pour ce stagiaire' 
        });
      }

      // Vérifier que le mémoire est dans un état modifiable
      if (memoire.status === 'مقبول' || memoire.status === 'مرفوض') {
        return res.status(400).json({ 
          message: 'Ce mémoire ne peut plus être modifié car il a déjà été évalué' 
        });
      }

      // Préparer les données de mise à jour
      const updateData = {};
      if (titre_fr) updateData.titre_fr = titre_fr;
      if (titre_ar) updateData.titre_ar = titre_ar;
      
      // Si un fichier a été uploadé, mettre à jour le chemin
      if (req.file) {
        updateData.fichierpdf = req.file.path;
      }

      await memoire.update(updateData);
      
      // Récupérer le mémoire mis à jour avec les relations
      const updatedMemoire = await Memoire.findByPk(memoire.id_memoire, {
        include: [
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar']
          }
        ]
      });

      return res.json({
        message: 'Mémoire mis à jour avec succès',
        memoire: updatedMemoire
      });
    } catch (error) {
      console.error('Error in updateMemoireByStagiaire:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la mise à jour du mémoire', 
        error: error.message 
      });
    }
  },

  // 4. ENSEIGNANT: Get memoires to validate
  async getMemoiresToValidateByEnseignant(req, res) {
    try {
      const { id_enseignant } = req.params;
      
      const memoires = await Memoire.findAll({
        where: { 
          id_enseignant,
          status: { [Op.in]: ['مقدم'] } // Only submitted memoires
        },
        include: [
          {
            model: Stagiaire,
            as: 'stagiaire',
            attributes: ['id_stagiaire', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar', 'email']
          }
        ],
        order: [['createdAt', 'ASC']] // Oldest first
      });

      return res.json(memoires);
    } catch (error) {
      console.error('Error in getMemoiresToValidateByEnseignant:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des mémoires à valider', 
        error: error.message 
      });
    }
  },

  // 5. ENSEIGNANT: Validate or reject memoire
  async validateMemoireByEnseignant(req, res) {
    try {
      const { id_memoire } = req.params;
      const { status, observation } = req.body;
      
      if (!status || !['مقبول', 'مرفوض'].includes(status)) {
        return res.status(400).json({ 
          message: 'Status invalide. Utilisez "مقبول" ou "مرفوض"' 
        });
      }

      const memoire = await Memoire.findByPk(id_memoire, {
        include: [
          {
            model: Stagiaire,
            as: 'stagiaire',
            attributes: ['id_stagiaire', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar']
          }
        ]
      });

      if (!memoire) {
        return res.status(404).json({ 
          message: 'Mémoire introuvable' 
        });
      }

      // Vérifier que l'enseignant est bien l'encadreur
      const { id_compte } = req.user;
      const enseignant = await Enseignant.findOne({ where: { compte_id: id_compte } });
      
      if (!enseignant || memoire.id_enseignant !== enseignant.id_enseignant) {
        return res.status(403).json({ 
          message: 'Vous n\'avez pas l\'autorisation de valider ce mémoire' 
        });
      }

      // Vérifier que le mémoire a des données à valider
      if (!memoire.titre_fr && !memoire.titre_ar && !memoire.fichierpdf) {
        return res.status(400).json({ 
          message: 'Le mémoire ne peut pas être validé car il n\'a pas encore été complété par le stagiaire' 
        });
      }

      await memoire.update({ 
        status, 
        observation: observation || null 
      });

      return res.json({
        message: `Mémoire ${status === 'مقبول' ? 'accepté' : 'refusé'} avec succès`,
        memoire
      });
    } catch (error) {
      console.error('Error in validateMemoireByEnseignant:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la validation du mémoire', 
        error: error.message 
      });
    }
  },

  // 6. Get accepted memoires for colleagues (by stagiaire's offers)
  async getAcceptedMemoiresByOffers(req, res) {
    try {
      const { id_stagiaire } = req.params;
      
      // Récupérer les offres du stagiaire
      const inscriptions = await Inscription.findAll({
        where: { id_stagiaire },
        attributes: ['id_offre']
      });

      const offreIds = inscriptions.map(inscription => inscription.id_offre);

      if (offreIds.length === 0) {
        return res.json([]);
      }

      // Récupérer tous les stagiaires de ces offres (sauf le stagiaire actuel)
      const autresInscriptions = await Inscription.findAll({
        where: { 
          id_offre: { [Op.in]: offreIds },
          id_stagiaire: { [Op.ne]: id_stagiaire }
        },
        attributes: ['id_stagiaire']
      });

      const autreStagiaireIds = [...new Set(autresInscriptions.map(inscription => inscription.id_stagiaire))];

      if (autreStagiaireIds.length === 0) {
        return res.json([]);
      }

      // Récupérer les mémoires acceptés de ces autres stagiaires
      const memoires = await Memoire.findAll({
        where: { 
          id_stagiaire: { [Op.in]: autreStagiaireIds },
          status: 'مقبول' // Only accepted memoires
        },
        include: [
          {
            model: Stagiaire,
            as: 'stagiaire',
            attributes: ['id_stagiaire', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar']
          },
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar']
          }
        ],
        order: [['updatedAt', 'DESC']] // Most recently updated first
      });

      return res.json(memoires);
    } catch (error) {
      console.error('Error in getAcceptedMemoiresByOffers:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des mémoires des collègues', 
        error: error.message 
      });
    }
  },

  // ==============================================
  // END OF DETAILED WORKFLOW METHODS
  // ==============================================

  // Changer le statut d'un mémoire
  async updateMemoireStatus(req, res) {
    try {
      const { id_memoire } = req.params;
      const { status } = req.body;
      
      const memoire = await Memoire.findByPk(id_memoire);
      if (!memoire) {
        return res.status(404).json({ message: 'Mémoire introuvable' });
      }

      memoire.status = status;
      await memoire.save();
      
      return res.json(memoire);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Servir un fichier PDF de mémoire
  async servePDF(req, res) {
    try {
      const { filename } = req.params;
      
      if (!filename) {
        return res.status(400).json({ message: 'Nom de fichier requis' });
      }

      const filePath = path.join(__dirname, '../upload/memoires', filename);
      
      // Vérifier que le fichier existe
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Fichier non trouvé' });
      }

      // Vérifier que l'utilisateur a accès au mémoire
      const memoire = await Memoire.findOne({
        where: { fichierpdf: filename },
        include: [
          {
            model: Stagiaire,
            as: 'stagiaire',
            attributes: ['nom_fr', 'prenom_fr']
          },
          {
            model: Enseignant,
            as: 'enseignant',
            attributes: ['nom_fr', 'prenom_fr']
          }
        ]
      });

      if (!memoire) {
        return res.status(404).json({ message: 'Mémoire non trouvé' });
      }

      // Vérifier les permissions selon le rôle de l'utilisateur
      const userRole = req.user.role;
      
      if (userRole === 'Stagiaire') {
        // Les stagiaires peuvent voir les mémoires validés de leurs collègues
        if (memoire.status !== 'مقبول') {
          return res.status(403).json({ message: 'Accès refusé - Mémoire non validé' });
        }
      } else if (userRole === 'Enseignant') {
        // Les enseignants peuvent voir tous les mémoires validés
        if (memoire.status !== 'مقبول') {
          return res.status(403).json({ message: 'Accès refusé - Mémoire non validé' });
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
      console.error('Erreur servePDF memoire:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = MemoireController;


