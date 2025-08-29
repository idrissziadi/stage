// models/Inscription.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Inscription = sequelize.define('Inscription', {
  id_inscription: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_stagiaire: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_offre: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date_inscription: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  statut: {
    type: DataTypes.ENUM('en_attente', 'acceptee', 'refusee', 'annulee'),
    allowNull: false,
    defaultValue: 'en_attente'
  }
}, {
  tableName: 'Inscription',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    { fields: ['id_stagiaire'] },
    { fields: ['id_offre'] },
    { unique: true, fields: ['id_stagiaire', 'id_offre'] }
  ]
});

module.exports = Inscription;



