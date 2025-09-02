// models/Grade.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Grade = sequelize.define('Grade', {
  id_grade: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identifiant unique du grade'
  },
  code_grade: {
    type: DataTypes.STRING(50),
    unique: {
      name: 'unique_code_grade',
      msg: 'Ce code de grade existe déjà'
    },
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le code de grade ne peut pas être vide'
      },
      len: {
        args: [2, 50],
        msg: 'Le code de grade doit contenir entre 2 et 50 caractères'
      }
    },
    comment: 'Code unique du grade'
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
    comment: 'Désignation du grade en français'
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
    comment: 'Désignation du grade en arabe'
  }
}, {
  tableName: 'Grade',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      unique: true,
      fields: ['code_grade']
    },
    {
      fields: ['designation_fr']
    }
  ],
  hooks: {
    beforeValidate: (grade) => {
      if (grade.code_grade) {
        grade.code_grade = grade.code_grade.toUpperCase().trim();
      }
    }
  }
});

module.exports = Grade;