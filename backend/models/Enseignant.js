
// models/Enseignant.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Enseignant = sequelize.define('Enseignant', {
  id_enseignant: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identifiant unique de l\'enseignant'
  },
  nom_fr: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: {
        args: [0, 100],
        msg: 'Le nom français ne peut pas dépasser 100 caractères'
      }
    },
    comment: 'Nom de l\'enseignant en français'
  },
  nom_ar: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: {
        args: [0, 100],
        msg: 'Le nom arabe ne peut pas dépasser 100 caractères'
      }
    },
    comment: 'Nom de l\'enseignant en arabe'
  },
  prenom_fr: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: {
        args: [0, 100],
        msg: 'Le prénom français ne peut pas dépasser 100 caractères'
      }
    },
    comment: 'Prénom de l\'enseignant en français'
  },
  prenom_ar: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: {
        args: [0, 100],
        msg: 'Le prénom arabe ne peut pas dépasser 100 caractères'
      }
    },
    comment: 'Prénom de l\'enseignant en arabe'
  },
  date_naissance: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Format de date invalide'
      },
      isBefore: {
        args: new Date().toISOString().split('T')[0],
        msg: 'La date de naissance ne peut pas être dans le futur'
      },
      isAfter: {
        args: '1900-01-01',
        msg: 'La date de naissance doit être postérieure à 1900'
      }
    },
    comment: 'Date de naissance de l\'enseignant'
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
    comment: 'Adresse email de l\'enseignant'
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
    comment: 'Numéro de téléphone de l\'enseignant'
  },
  id_grade: {
    type: DataTypes.INTEGER,
    allowNull: true, // Made nullable to allow account creation
    comment: 'Référence vers le grade de l\'enseignant'
  },
  id_etab_formation: {
    type: DataTypes.INTEGER,
    allowNull: true, // Made nullable to allow account creation
    comment: 'Référence vers l\'établissement de formation'
  },
  compte_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Changed from false to true to allow null values
    references: {
      model: 'Compte',
      key: 'id_compte'
    },
    onDelete: 'SET NULL', // Changed from CASCADE to SET NULL
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'Enseignant',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      fields: ['nom_fr', 'prenom_fr']
    },
    {
      fields: ['nom_ar', 'prenom_ar']
    },
    {
      fields: ['id_grade']
    },
    {
      fields: ['id_etab_formation']
    },
    {
      unique: true,
      fields: ['email'],
      where: {
        email: {
          [require('sequelize').Op.ne]: null
        }
      }
    }
  ],
  hooks: {
    beforeValidate: (enseignant) => {
      if (enseignant.email) {
        enseignant.email = enseignant.email.toLowerCase().trim();
      }
      // Capitalisation des noms
      if (enseignant.nom_fr) {
        enseignant.nom_fr = enseignant.nom_fr.trim().toUpperCase();
      }
      if (enseignant.prenom_fr) {
        enseignant.prenom_fr = enseignant.prenom_fr.trim()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
    }
  },
  getterMethods: {
    nomComplet() {
      return `${this.nom_fr || ''} ${this.prenom_fr || ''}`.trim();
    },
    age() {
      if (this.date_naissance) {
        const today = new Date();
        const birthDate = new Date(this.date_naissance);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      }
      return null;
    }
  }
});

module.exports = Enseignant;