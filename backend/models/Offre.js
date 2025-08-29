// models/Offre.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Offre = sequelize.define('Offre', {
  id_offre: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_specialite: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Référence vers la spécialité'
  },
  id_etab_formation: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Référence vers l\'établissement de formation'
  },
  id_diplome: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Référence vers le diplôme'
  },
  id_mode: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Référence vers le mode de formation'
  },
  // designation_fr and designation_ar fields don't exist in database
  // Removed to match actual schema
  date_debut: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Format de date de début invalide'
      }
    },
    comment: 'Date de début de la formation'
  },
  date_fin: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Format de date de fin invalide'
      },
      isAfterDateDebut(value) {
        if (value && this.date_debut && new Date(value) <= new Date(this.date_debut)) {
          throw new Error('La date de fin doit être postérieure à la date de début');
        }
      }
    },
    comment: 'Date de fin de la formation'
  },
  statut: {
    type: DataTypes.ENUM('brouillon', 'active', 'archivee'),
    allowNull: false,
    defaultValue: 'brouillon',
    validate: {
      isIn: {
        args: [['brouillon', 'active', 'archivee']],
        msg: 'Le statut doit être brouillon, active ou archivee'
      }
    },
    comment: 'Statut de l\'offre: brouillon, active, archivee'
  }
}, {
  tableName: 'Offre',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      unique: true,
      fields: ['id_specialite', 'id_etab_formation', 'id_diplome', 'id_mode']
    },
    {
      fields: ['id_specialite']
    },
    {
      fields: ['id_etab_formation']
    },
    {
      fields: ['date_debut']
    },
    {
      fields: ['date_fin']
    },
    {
      fields: ['statut']
    }
  ],
  getterMethods: {
    designation_fr() {
      // Computed from specialite and diplome when they are included
      if (this.specialite && this.diplome) {
        return `${this.specialite.designation_fr} - ${this.diplome.designation_fr}`;
      } else if (this.specialite) {
        return this.specialite.designation_fr;
      } else if (this.diplome) {
        return this.diplome.designation_fr;
      }
      return 'Formation';
    },
    designation_ar() {
      // Computed from specialite and diplome when they are included
      if (this.specialite && this.diplome) {
        const specAr = this.specialite.designation_ar || this.specialite.designation_fr;
        const dipAr = this.diplome.designation_ar || this.diplome.designation_fr;
        return `${specAr} - ${dipAr}`;
      } else if (this.specialite) {
        return this.specialite.designation_ar || this.specialite.designation_fr;
      } else if (this.diplome) {
        return this.diplome.designation_ar || this.diplome.designation_fr;
      }
      return 'تكوين';
    },
    dureeFormation() {
      if (this.date_debut && this.date_fin) {
        const debut = new Date(this.date_debut);
        const fin = new Date(this.date_fin);
        const diffTime = Math.abs(fin - debut);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      }
      return null;
    }
  }
});

module.exports = Offre;