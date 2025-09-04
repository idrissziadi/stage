

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Stagiaire = sequelize.define('Stagiaire', {
  id_stagiaire: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: 'Identifiant unique du stagiaire'
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
    comment: 'Nom du stagiaire en français'
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
    comment: 'Nom du stagiaire en arabe'
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
    comment: 'Prénom du stagiaire en français'
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
    comment: 'Prénom du stagiaire en arabe'
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
    comment: 'Date de naissance du stagiaire'
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
    comment: 'Adresse email du stagiaire'
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
    comment: 'Numéro de téléphone du stagiaire'
  },
  compte_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Compte',
      key: 'id_compte'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'Stagiaire',
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
    beforeValidate: (stagiaire) => {
      if (stagiaire.email) {
        stagiaire.email = stagiaire.email.toLowerCase().trim();
      }
      // Capitalisation des noms
      if (stagiaire.nom_fr) {
        stagiaire.nom_fr = stagiaire.nom_fr.trim().toUpperCase();
      }
      if (stagiaire.prenom_fr) {
        stagiaire.prenom_fr = stagiaire.prenom_fr.trim()
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

module.exports = Stagiaire;
