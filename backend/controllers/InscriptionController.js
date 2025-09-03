const Inscription = require('../models/Inscription');
const Stagiaire = require('../models/Stagiaire');
const Offre = require('../models/Offre');
const Specialite = require('../models/Specialite');
const EtablissementFormation = require('../models/EtablissementFormation');
const Diplome = require('../models/Diplome');
const Mode_Formation = require('../models/Mode_Formation');

const InscriptionController = {
  // Récupérer les inscriptions d'un stagiaire
  async getInscriptionsByStagiaire(req, res) {
    try {
      const { id_stagiaire } = req.params;
      console.log('Fetching inscriptions for stagiaire:', id_stagiaire);
      
      const inscriptions = await Inscription.findAll({
        where: { id_stagiaire },
        include: [
          {
            model: Offre,
            as: 'offre',
            // Removed designation_fr and designation_ar from attributes since they are virtual fields
            // Also removed 'description' field which doesn't exist in the Offre model
            attributes: ['id_offre'],
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
              },
              {
                model: Diplome,
                as: 'diplome',
                attributes: ['designation_fr', 'designation_ar'],
                required: false
              },
              {
                model: Mode_Formation,
                as: 'modeFormation',
                attributes: ['designation_fr', 'designation_ar'],
                required: false
              }
            ],
            required: false
          }
        ]
      });

      console.log('Found inscriptions:', inscriptions.length);
      return res.json(inscriptions);
    } catch (error) {
      console.error('Error in getInscriptionsByStagiaire:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Créer une nouvelle inscription
  async createInscription(req, res) {
    try {
      const { id_stagiaire, id_offre } = req.body;
      
      // Vérifier si l'inscription existe déjà
      const existingInscription = await Inscription.findOne({
        where: { id_stagiaire, id_offre }
      });
      
      if (existingInscription) {
        return res.status(409).json({ message: 'Inscription déjà existante' });
      }

      const inscription = await Inscription.create({
        id_stagiaire,
        id_offre,
        date_inscription: new Date(),
        statut: 'acceptee'
      });

      return res.status(201).json(inscription);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Mettre à jour le statut d'une inscription
  async updateInscriptionStatus(req, res) {
    try {
      const { id_inscription } = req.params;
      const { statut } = req.body;
      
      const inscription = await Inscription.findByPk(id_inscription);
      if (!inscription) {
        return res.status(404).json({ message: 'Inscription introuvable' });
      }

      inscription.statut = statut;
      await inscription.save();
      
      return res.json(inscription);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Supprimer une inscription
  async deleteInscription(req, res) {
    try {
      const { id_inscription } = req.params;
      
      const inscription = await Inscription.findByPk(id_inscription);
      if (!inscription) {
        return res.status(404).json({ message: 'Inscription introuvable' });
      }

      await inscription.destroy();
      return res.json({ message: 'Inscription supprimée avec succès' });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = InscriptionController;

