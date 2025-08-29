// models/EtablissementNationale.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EtablissementNationale = sequelize.define('EtablissementNationale', {
  id_etab_nationale: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identifiant unique de l\'établissement national'
  },
  code: {
    type: DataTypes.STRING(50),
    unique: {
      name: 'unique_code_etab_nationale',
      msg: 'Ce code d\'établissement national existe déjà'
    },
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le code ne peut pas être vide'
      },
      len: {
        args: [2, 50],
        msg: 'Le code doit contenir entre 2 et 50 caractères'
      }
    },
    comment: 'Code unique de l\'établissement national'
  },
  nom_fr: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le nom français ne peut pas être vide'
      },
      len: {
        args: [2, 255],
        msg: 'Le nom français doit contenir entre 2 et 255 caractères'
      }
    },
    comment: 'Nom de l\'établissement en français'
  },
  nom_ar: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le nom arabe ne peut pas être vide'
      },
      len: {
        args: [2, 255],
        msg: 'Le nom arabe doit contenir entre 2 et 255 caractères'
      }
    },
    comment: 'Nom de l\'établissement en arabe'
  },
  adresse_fr: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: 'L\'adresse française ne peut pas dépasser 255 caractères'
      }
    },
    comment: 'Adresse de l\'établissement en français'
  },
  adresse_ar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: 'L\'adresse arabe ne peut pas dépasser 255 caractères'
      }
    },
    comment: 'Adresse de l\'établissement en arabe'
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: {
        msg: 'Format d\'email invalide'
      },
      len: {
        args: [0, 100],
        msg: 'L\'email ne peut pas dépasser 100 caractères'
      }
    },
    comment: 'Adresse email de l\'établissement'
  },
  telephone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      len: {
        args: [0, 20],
        msg: 'Le numéro de téléphone ne peut pas dépasser 20 caractères'
      },
      is: {
        args: /^[\+]?[0-9\s\-\(\)]*$/,
        msg: 'Format de numéro de téléphone invalide'
      }
    },
    comment: 'Numéro de téléphone de l\'établissement'
  },
 compte_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Compte',
      key: 'id_compte'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'EtablissementNationale',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      unique: true,
      fields: ['code']
    },
    {
      fields: ['nom_fr']
    }
  ],
  hooks: {
    beforeValidate: (etablissement) => {
      if (etablissement.code) {
        etablissement.code = etablissement.code.toUpperCase().trim();
      }
      if (etablissement.email) {
        etablissement.email = etablissement.email.toLowerCase().trim();
      }
    }
  }
});

module.exports = EtablissementNationale;



