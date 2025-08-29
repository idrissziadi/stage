// models/TokenBlacklist.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TokenBlacklist = sequelize.define('TokenBlacklist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tokenHash: {
    type: DataTypes.CHAR(64),
    allowNull: false,
    unique: true,
    comment: 'SHA-256 hex digest of the JWT token'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'TokenBlacklist',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    { fields: ['expiresAt'] },
    { unique: true, fields: ['tokenHash'] }
  ]
});

module.exports = TokenBlacklist;


