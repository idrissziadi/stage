// models/Branche.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Branche = sequelize.define('Branche', {
  id_branche: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identifiant unique de la branche'
  },
  code_branche: {
    type: DataTypes.STRING(50),
    unique: {
      name: 'unique_code_branche',
      msg: 'Ce code de branche existe déjà'
    },
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le code de branche ne peut pas être vide'
      },
      len: {
        args: [2, 50],
        msg: 'Le code de branche doit contenir entre 2 et 50 caractères'
      }
    },
    comment: 'Code unique de la branche'
  },
  designation_fr: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La désignation française ne peut pas être vide'
      },
      len: {
        args: [2, 255],
        msg: 'La désignation française doit contenir entre 2 et 255 caractères'
      }
    },
    comment: 'Désignation de la branche en français'
  },
  designation_ar: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La désignation arabe ne peut pas être vide'
      },
      len: {
        args: [2, 255],
        msg: 'La désignation arabe doit contenir entre 2 et 255 caractères'
      }
    },
    comment: 'Désignation de la branche en arabe'
  },
  id_etab_regionale: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Référence vers l\'établissement régional'
  }
}, {
  tableName: 'Branche',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      unique: true,
      fields: ['code_branche']
    },
    {
      fields: ['id_etab_regionale']
    },
    {
      fields: ['designation_fr']
    }
  ],
  hooks: {
    beforeValidate: (branche) => {
      if (branche.code_branche) {
        branche.code_branche = branche.code_branche.toUpperCase().trim();
      }
    }
  }
});

module.exports = Branche;
