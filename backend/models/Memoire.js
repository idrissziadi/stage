// models/Memoire.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Memoire = sequelize.define('Memoire', {
  id_memoire: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identifiant unique du mémoire'
  },
  titre_fr: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: 'Le titre français ne peut pas dépasser 255 caractères'
      }
    },
    comment: 'Titre du mémoire en français'
  },
  titre_ar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: 'Le titre arabe ne peut pas dépasser 255 caractères'
      }
    },
    comment: 'Titre du mémoire en arabe'
  },
  fichierpdf: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: 'Le chemin du fichier PDF ne peut pas dépasser 255 caractères'
      },
      is: {
        args: /^.*\.(pdf|PDF)$/,
        msg: 'Le fichier doit être au format PDF'
      }
    },
    comment: 'Chemin vers le fichier PDF du mémoire'
  },
  status: {
    type: DataTypes.ENUM('مقدم', 'مقبول', 'مرفوض'),
    defaultValue: 'مقدم',
    allowNull: false,
    validate: {
      isIn: {
        args: [['مقدم', 'مقبول', 'مرفوض']],
        msg: 'Statut invalide'
      }
    },
    comment: 'Statut du mémoire (soumis, accepté, refusé)'
  },
  observation: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Observations sur le mémoire'
  },
  id_stagiaire: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Référence vers le stagiaire auteur'
  },
  id_enseignant: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Référence vers l\'enseignant encadreur'
  }
}, {
  tableName: 'Memoire',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      fields: ['id_stagiaire']
    },
    {
      fields: ['id_enseignant']
    },
    {
      fields: ['status']
    },
    {
      fields: ['titre_fr']
    }
  ],
  hooks: {
    beforeValidate: (memoire) => {
      if (memoire.fichierpdf) {
        memoire.fichierpdf = memoire.fichierpdf.trim();
      }
    }
  },
  getterMethods: {
    statusFr() {
      const statusMap = {
        'مقدم': 'Soumis',
        'مقبول': 'Accepté',
        'مرفوض': 'Refusé'
      };
      return statusMap[this.status] || this.status;
    },
    hasFile() {
      return !!this.fichierpdf;
    },
    hasEncadreur() {
      return !!this.id_enseignant;
    }
  }
});

module.exports = Memoire;