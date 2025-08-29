// models/Diplome.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Diplome = sequelize.define('Diplome', {
  id_diplome: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  designation_fr: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  designation_ar: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  niveau: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'diplome',
  timestamps: false
});

module.exports = Diplome;