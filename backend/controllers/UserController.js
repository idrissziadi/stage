const { Op } = require('sequelize');
const Compte = require('../models/Compte');
const Stagiaire = require('../models/Stagiaire');
const Enseignant = require('../models/Enseignant');
const EtablissementFormation = require('../models/EtablissementFormation');
const Grade = require('../models/Grade');

const UserController = {
  // Récupérer le profil utilisateur connecté
  async getProfile(req, res) {
    try {
      const { id_compte } = req.user;
      
      const compte = await Compte.findByPk(id_compte);
      if (!compte) {
        return res.status(404).json({ message: 'Compte introuvable' });
      }

      // Récupérer les données spécifiques selon le rôle
      let profileData = {
        user_id: compte.id_compte,
        email_for_auth: compte.username,
        username: compte.username,
        role: compte.role,
        created_at: compte.createdAt,
        updated_at: compte.updatedAt
      };

      switch (compte.role) {
        case 'Stagiaire':
          const stagiaire = await Stagiaire.findOne({ where: { compte_id: id_compte } });
          if (stagiaire) {
            profileData = { ...profileData, ...stagiaire.toJSON() };
          }
          break;
        case 'Enseignant':
          const enseignant = await Enseignant.findOne({ 
            where: { compte_id: id_compte },
            include: [
              {
                model: Grade,
                as: 'grade',
                attributes: ['designation_fr', 'designation_ar', 'code_grade']
              },
              {
                model: EtablissementFormation,
                as: 'etablissementFormation',
                attributes: ['nom_fr', 'nom_ar', 'code']
              }
            ]
          });
          if (enseignant) {
            const enseignantData = enseignant.toJSON();
            // Add grade and etablissement_formation as direct properties for frontend compatibility
            enseignantData.grade = enseignantData.grade ? enseignantData.grade.designation_ar || enseignantData.grade.designation_fr : null;
            enseignantData.etablissement_formation = enseignantData.etablissementFormation ? enseignantData.etablissementFormation.nom_ar || enseignantData.etablissementFormation.nom_fr : null;
            profileData = { ...profileData, ...enseignantData };
          }
          break;
        case 'EtablissementFormation':
          const etabFormation = await EtablissementFormation.findOne({ where: { compte_id: id_compte } });
          if (etabFormation) {
            profileData = { ...profileData, ...etabFormation.toJSON() };
          }
          break;
      }

      return res.json(profileData);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Mettre à jour le profil utilisateur
  async updateProfile(req, res) {
    try {
      const { id_compte } = req.user;
      const updateData = req.body;

      const compte = await Compte.findByPk(id_compte);
      if (!compte) {
        return res.status(404).json({ message: 'Compte introuvable' });
      }

      // Mettre à jour les données du compte
      if (updateData.username) {
        compte.username = updateData.username;
      }
      await compte.save();

      // Mettre à jour les données spécifiques selon le rôle
      switch (compte.role) {
        case 'Stagiaire':
          await Stagiaire.update(updateData, { where: { compte_id: id_compte } });
          break;
        case 'Enseignant':
          // Map frontend fields to database fields
          const enseignantUpdateData = { ...updateData };
          
          // Handle grade field mapping
          if (updateData.grade && typeof updateData.grade === 'string') {
            // If grade is provided as a string, try to find the corresponding grade ID
            const gradeRecord = await Grade.findOne({
              where: {
                [Op.or]: [
                  { designation_ar: updateData.grade },
                  { designation_fr: updateData.grade },
                  { code_grade: updateData.grade }
                ]
              }
            });
            if (gradeRecord) {
              enseignantUpdateData.id_grade = gradeRecord.id_grade;
            }
            delete enseignantUpdateData.grade;
          }
          
          // Handle etablissement_formation field mapping
          if (updateData.etablissement_formation && typeof updateData.etablissement_formation === 'string') {
            // If etablissement is provided as a string, try to find the corresponding etablissement ID
            const etablissementRecord = await EtablissementFormation.findOne({
              where: {
                [Op.or]: [
                  { nom_ar: updateData.etablissement_formation },
                  { nom_fr: updateData.etablissement_formation },
                  { code: updateData.etablissement_formation }
                ]
              }
            });
            if (etablissementRecord) {
              enseignantUpdateData.id_etab_formation = etablissementRecord.id_etab_formation;
            }
            delete enseignantUpdateData.etablissement_formation;
          }
          
          await Enseignant.update(enseignantUpdateData, { where: { compte_id: id_compte } });
          break;
        case 'EtablissementFormation':
          await EtablissementFormation.update(updateData, { where: { compte_id: id_compte } });
          break;
      }

      return res.json({ message: 'Profil mis à jour avec succès' });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = UserController;

