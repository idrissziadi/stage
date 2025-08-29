const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SpecialiteEtab = sequelize.define('SpecialiteEtab', { // nom de table court
  id: { // id généré par Sequelize
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_specialite: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Référence vers la spécialité'
  },
  id_etab_formation: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Référence vers l\'établissement de formation'
  },
  date_ouverture: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: { msg: 'Format de date d\'ouverture invalide' }
    },
    comment: 'Date d\'ouverture de la spécialité dans l\'établissement'
  },
  actif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
    comment: 'Statut actif/inactif de la spécialité dans l\'établissement'
  }
}, {
  tableName: 'spc_etab', // nom court pour la table
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    { fields: ['id_specialite'], name: 'idx_spc' },
    { fields: ['id_etab_formation'], name: 'idx_etab' },
    { unique: true, fields: ['id_specialite', 'id_etab_formation'], name: 'uq_spc_etab' } // index unique court
  ]
});

module.exports = SpecialiteEtab;
