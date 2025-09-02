const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const Offre = require('../models/Offre');
const Specialite = require('../models/Specialite');
const EtablissementFormation = require('../models/EtablissementFormation');
const Diplome = require('../models/Diplome');
const Mode_Formation = require('../models/Mode_Formation');

const OffreController = {
  // Get all offres
  async getAllOffres(req, res) {
    try {
      const { limit = 50, offset = 0, search } = req.query;

      let whereClause = {};
      // Note: designation_fr and designation_ar fields don't exist in database
      // Search functionality disabled until proper searchable fields are identified

      const offres = await Offre.findAndCountAll({
        where: whereClause,
        // Removed designation_fr and designation_ar from attributes since they are virtual fields
        // Also removed 'description' field which doesn't exist in the Offre model
        attributes: ['id_offre', 'date_debut', 'date_fin', 'statut'],
        include: [
          {
            model: Specialite,
            as: 'specialite',
            attributes: ['id_specialite', 'designation_fr', 'designation_ar'],
            required: false
          },
          {
            model: EtablissementFormation,
            as: 'etablissementFormation',
            attributes: ['id_etab_formation', 'nom_fr', 'nom_ar'],
            required: false
          },
          {
            model: Diplome,
            as: 'diplome',
            attributes: ['id_diplome', 'designation_fr', 'designation_ar'],
            required: false
          },
          {
            model: Mode_Formation,
            as: 'modeFormation',
            attributes: ['id_mode', 'designation_fr', 'designation_ar'],
            required: false
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return res.json({
        offres: offres.rows,
        total: offres.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

    } catch (error) {
      console.error('Error fetching offres:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des offres', 
        error: error.message 
      });
    }
  },

  // Get offres by establishment
  async getOffresByEtablissement(req, res) {
    try {
      const { id_etab_formation } = req.params;
      const { limit = 50, offset = 0, search } = req.query;

      let whereClause = { id_etab_formation: parseInt(id_etab_formation) };
      
      // Note: designation_fr and designation_ar fields don't exist in database
      // Search functionality disabled until proper searchable fields are identified

      const offres = await Offre.findAndCountAll({
        where: whereClause,
        // Removed designation_fr and designation_ar from attributes since they are virtual fields
        // Also removed 'description' field which doesn't exist in the Offre model
        attributes: ['id_offre', 'date_debut', 'date_fin', 'statut'],
        include: [
          {
            model: Specialite,
            as: 'specialite',
            attributes: ['id_specialite', 'designation_fr', 'designation_ar'],
            required: false
          },
          {
            model: Diplome,
            as: 'diplome',
            attributes: ['id_diplome', 'designation_fr', 'designation_ar'],
            required: false
          },
          {
            model: Mode_Formation,
            as: 'modeFormation',
            attributes: ['id_mode', 'designation_fr', 'designation_ar'],
            required: false
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return res.json({
        offres: offres.rows,
        total: offres.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

    } catch (error) {
      console.error('Error fetching offres by etablissement:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  // Create new offre
  async createOffre(req, res) {
    try {
      const {
        id_specialite,
        id_etab_formation,
        id_diplome,
        id_mode,
        // designation_fr, designation_ar - fields don't exist in database
        // description - field doesn't exist in database
        date_debut,
        date_fin,
        statut
      } = req.body;

      if (!id_specialite || !id_etab_formation || !id_mode) {
        return res.status(400).json({
          message: 'Les champs id_specialite, id_etab_formation et id_mode sont obligatoires'
        });
      }

      const offre = await Offre.create({
        id_specialite: parseInt(id_specialite),
        id_etab_formation: parseInt(id_etab_formation),
        id_diplome: id_diplome ? parseInt(id_diplome) : 1, // Default diplome ID
        id_mode: parseInt(id_mode),
        // designation_fr, designation_ar - fields don't exist in database
        // description - field doesn't exist in database
        date_debut,
        date_fin,
        statut: statut || 'brouillon' // Default to 'brouillon' if not provided
      });

      // Fetch the created offre with relations
      const createdOffre = await Offre.findByPk(offre.id_offre, {
        // Removed designation_fr and designation_ar from attributes since they are virtual fields
        // Also removed 'description' field which doesn't exist in the Offre model
        attributes: ['id_offre', 'date_debut', 'date_fin', 'statut'],
        include: [
          {
            model: Specialite,
            as: 'specialite',
            attributes: ['id_specialite', 'designation_fr', 'designation_ar'],
            required: false
          },
          {
            model: Diplome,
            as: 'diplome',
            attributes: ['id_diplome', 'designation_fr', 'designation_ar'],
            required: false
          },
          {
            model: Mode_Formation,
            as: 'modeFormation',
            attributes: ['id_mode', 'designation_fr', 'designation_ar'],
            required: false
          }
        ]
      });

      return res.status(201).json({
        message: 'Offre créée avec succès',
        offre: createdOffre
      });

    } catch (error) {
      console.error('Error creating offre:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la création de l\'offre', 
        error: error.message 
      });
    }
  },

  // Update offre
  async updateOffre(req, res) {
    try {
      const { id_offre } = req.params;
      const updateData = req.body;

      const offre = await Offre.findByPk(id_offre);
      if (!offre) {
        return res.status(404).json({ message: 'Offre introuvable' });
      }

      await offre.update(updateData);

      // Return updated offre with relations
      const updatedOffre = await Offre.findByPk(id_offre, {
        // Removed designation_fr and designation_ar from attributes since they are virtual fields
        attributes: ['id_offre', 'date_debut', 'date_fin', 'statut'],
        include: [
          {
            model: Specialite,
            as: 'specialite',
            attributes: ['id_specialite', 'designation_fr', 'designation_ar'],
            required: false
          },
          {
            model: Diplome,
            as: 'diplome',
            attributes: ['id_diplome', 'designation_fr', 'designation_ar'],
            required: false
          },
          {
            model: Mode_Formation,
            as: 'modeFormation',
            attributes: ['id_mode', 'designation_fr', 'designation_ar'],
            required: false
          }
        ]
      });

      return res.json({
        message: 'Offre mise à jour avec succès',
        offre: updatedOffre
      });

    } catch (error) {
      console.error('Error updating offre:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la mise à jour de l\'offre', 
        error: error.message 
      });
    }
  },

  // Delete offre
  async deleteOffre(req, res) {
    try {
      const { id_offre } = req.params;

      const offre = await Offre.findByPk(id_offre);
      if (!offre) {
        return res.status(404).json({ message: 'Offre introuvable' });
      }

      await offre.destroy();

      return res.json({
        message: 'Offre supprimée avec succès'
      });

    } catch (error) {
      console.error('Error deleting offre:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la suppression de l\'offre', 
        error: error.message 
      });
    }
  }
};

module.exports = OffreController;

