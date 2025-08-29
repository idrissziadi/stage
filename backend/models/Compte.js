// models/Compte.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Compte = sequelize.define('Compte', {
  id_compte: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identifiant unique du compte'
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Le nom d’utilisateur ne peut pas être vide'
      },
      len: {
        args: [3, 50],
        msg: 'Le nom d’utilisateur doit contenir entre 3 et 50 caractères'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le mot de passe ne peut pas être vide'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('Stagiaire', 'Enseignant', 'EtablissementFormation', 'EtablissementRegionale', 'EtablissementNationale'),
    allowNull: false,
    comment: 'Rôle du compte'
  }
}, {
  tableName: 'Compte',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Compte;
