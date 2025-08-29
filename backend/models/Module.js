// models/Module.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Module = sequelize.define('Module', {
  id_module: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identifiant unique du module'
  },
  code_module: {
    type: DataTypes.STRING(50),
    unique: {
      name: 'unique_code_module',
      msg: 'Ce code de module existe déjà'
    },
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le code de module ne peut pas être vide'
      },
      len: {
        args: [2, 50],
        msg: 'Le code de module doit contenir entre 2 et 50 caractères'
      }
    },
    comment: 'Code unique du module'
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
    comment: 'Désignation du module en français'
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
    comment: 'Désignation du module en arabe'
  },
  id_specialite: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Référence vers la spécialité'
  }
}, {
  tableName: 'Module',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      unique: true,
      fields: ['code_module']
    },
    {
      fields: ['id_specialite']
    },
    {
      fields: ['designation_fr']
    }
  ],
  hooks: {
    beforeValidate: (module) => {
      if (module.code_module) {
        module.code_module = module.code_module.toUpperCase().trim();
      }
    }
  }
});

module.exports = Module;