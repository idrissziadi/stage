// models/Ens_Module.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Ens_Module = sequelize.define('Ens_Module', {
  id_module: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    comment: 'Référence vers le module'
  },
  id_enseignant: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    comment: 'Référence vers l\'enseignant'
  },
  annee_scolaire: {
    type: DataTypes.DATEONLY,
    primaryKey: true,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Format de date invalide pour l\'année scolaire'
      }
    },
    comment: 'Année scolaire de l\'enseignement'
  },
  semestre: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: {
        args: [0, 50],
        msg: 'Le semestre ne peut pas dépasser 50 caractères'
      },
      isIn: {
        args: [['S1', 'S2', 'S3', 'S4', 'Premier', 'Deuxième', '']],
        msg: 'Semestre invalide'
      }
    },
    comment: 'Semestre d\'enseignement'
  }
}, {
  tableName: 'Ens_Module',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      fields: ['id_module', 'id_enseignant']
    },
    {
      fields: ['annee_scolaire']
    },
    {
      fields: ['semestre']
    }
  ],
  hooks: {
    beforeValidate: (ensModule) => {
      if (ensModule.semestre) {
        ensModule.semestre = ensModule.semestre.trim();
      }
    }
  }
});

module.exports = Ens_Module;