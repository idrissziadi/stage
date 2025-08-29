// models/Specialite.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Specialite = sequelize.define('Specialite', {
  id_specialite: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identifiant unique de la spécialité'
  },
  code_specialite: {
    type: DataTypes.STRING(50),
    unique: {
      name: 'unique_code_specialite',
      msg: 'Ce code de spécialité existe déjà'
    },
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le code de spécialité ne peut pas être vide'
      },
      len: {
        args: [2, 50],
        msg: 'Le code de spécialité doit contenir entre 2 et 50 caractères'
      }
    },
    comment: 'Code unique de la spécialité'
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
    comment: 'Désignation de la spécialité en français'
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
    comment: 'Désignation de la spécialité en arabe'
  },
  id_branche: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Référence vers la branche'
  }
}, {
  tableName: 'Specialite',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      unique: true,
      fields: ['code_specialite']
    },
    {
      fields: ['id_branche']
    },
    {
      fields: ['designation_fr']
    }
  ],
  hooks: {
    beforeValidate: (specialite) => {
      if (specialite.code_specialite) {
        specialite.code_specialite = specialite.code_specialite.toUpperCase().trim();
      }
    }
  }
});

module.exports = Specialite;