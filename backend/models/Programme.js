// models/Programme.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Programme = sequelize.define('Programme', {
  id_programme: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code_programme: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  titre_fr: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  titre_ar: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  fichierpdf: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('في_الانتظار', 'مقبول', 'مرفوض'),
    defaultValue: 'في_الانتظار'
  },
  observation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  id_etab_regionale: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_module: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Programme',
  tableName: 'Programme',
  timestamps: true
});

module.exports = Programme;
