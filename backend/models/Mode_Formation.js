// models/Mode_Formation.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Mode_Formation = sequelize.define('Mode_Formation', {
  id_mode: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identifiant unique du mode de formation'
  },
  code_mode: {
    type: DataTypes.STRING(50),
    unique: {
      name: 'unique_code_mode',
      msg: 'Ce code de mode de formation existe déjà'
    },
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le code de mode ne peut pas être vide'
      },
      len: {
        args: [2, 50],
        msg: 'Le code de mode doit contenir entre 2 et 50 caractères'
      }
    },
    comment: 'Code unique du mode de formation'
  },
  designation_fr: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: 'La désignation française ne peut pas dépasser 255 caractères'
      }
    },
    comment: 'Désignation du mode de formation en français'
  },
  designation_ar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: 'La désignation arabe ne peut pas dépasser 255 caractères'
      }
    },
    comment: 'Désignation du mode de formation en arabe'
  }
}, {
  tableName: 'Mode_Formation',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      unique: true,
      fields: ['code_mode']
    },
    {
      fields: ['designation_fr']
    }
  ],
  hooks: {
    beforeValidate: (mode) => {
      if (mode.code_mode) {
        mode.code_mode = mode.code_mode.toUpperCase().trim();
      }
    }
  }
});

module.exports = Mode_Formation;