const EtablissementNationale = require('../models/EtablissementNationale');
const Compte = require('../models/Compte');

const EtablissementNationaleController = {
  // Créer un établissement national
  async create(req, res) {
    try {
      const { code, nom_fr, nom_ar, adresse_fr, adresse_ar, email, telephone, compte_id } = req.body;

      // Vérifier que le compte existe
      const compte = await Compte.findByPk(compte_id);
      if (!compte) {
        return res.status(404).json({ message: 'Compte introuvable' });
      }

      // Vérifier que le code est unique
      const existingEtab = await EtablissementNationale.findOne({ where: { code } });
      if (existingEtab) {
        return res.status(409).json({ message: 'Ce code d\'établissement existe déjà' });
      }

      // Créer l'établissement national
      const etabNationale = await EtablissementNationale.create({
        code,
        nom_fr,
        nom_ar,
        adresse_fr,
        adresse_ar,
        email,
        telephone,
        compte_id
      });

      res.status(201).json({
        message: 'Établissement national créé avec succès',
        etablissement: etabNationale
      });

    } catch (error) {
      console.error('Erreur lors de la création de l\'établissement national:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la création de l\'établissement national',
        error: error.message 
      });
    }
  },

  // Récupérer un établissement national par ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      const etabNationale = await EtablissementNationale.findByPk(id);
      if (!etabNationale) {
        return res.status(404).json({ message: 'Établissement national introuvable' });
      }

      res.json(etabNationale);

    } catch (error) {
      console.error('Erreur lors de la récupération de l\'établissement national:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération de l\'établissement national',
        error: error.message 
      });
    }
  },

  // Mettre à jour un établissement national
  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const etabNationale = await EtablissementNationale.findByPk(id);
      if (!etabNationale) {
        return res.status(404).json({ message: 'Établissement national introuvable' });
      }

      // Mettre à jour l'établissement
      await etabNationale.update(updateData);

      res.json({
        message: 'Établissement national mis à jour avec succès',
        etablissement: etabNationale
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'établissement national:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la mise à jour de l\'établissement national',
        error: error.message 
      });
    }
  },

  // Supprimer un établissement national
  async delete(req, res) {
    try {
      const { id } = req.params;

      const etabNationale = await EtablissementNationale.findByPk(id);
      if (!etabNationale) {
        return res.status(404).json({ message: 'Établissement national introuvable' });
      }

      // Supprimer l'établissement
      await etabNationale.destroy();

      res.json({ message: 'Établissement national supprimé avec succès' });

    } catch (error) {
      console.error('Erreur lors de la suppression de l\'établissement national:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la suppression de l\'établissement national',
        error: error.message 
      });
    }
  }
};

module.exports = EtablissementNationaleController;
