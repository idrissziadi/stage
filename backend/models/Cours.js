// models/Cours.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cours = sequelize.define('Cours', {
  id_cours: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identifiant unique du cours'
  },
  id_module: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Module',
      key: 'id_module'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    comment: 'Référence vers le module'
  },
  id_enseignant: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Enseignant',
      key: 'id_enseignant'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    comment: 'Référence vers l\'enseignant'
  },
  code_cours: {
    type: DataTypes.STRING(50),
    unique: {
      name: 'unique_code_cours',
      msg: 'Ce code de cours existe déjà'
    },
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le code de cours ne peut pas être vide'
      },
      len: {
        args: [2, 50],
        msg: 'Le code de cours doit contenir entre 2 et 50 caractères'
      }
    },
    comment: 'Code unique du cours'
  },
  titre_fr: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: 'Le titre français ne peut pas dépasser 255 caractères'
      }
    },
    comment: 'Titre du cours en français'
  },
  titre_ar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: 'Le titre arabe ne peut pas dépasser 255 caractères'
      }
    },
    comment: 'Titre du cours en arabe'
  },
  fichierpdf: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: 'Le chemin du fichier PDF ne peut pas dépasser 255 caractères'
      }
    },
    comment: 'Chemin vers le fichier PDF du cours'
  },
  status: {
    type: DataTypes.ENUM('في_الانتظار', 'مقبول', 'مرفوض'),
    defaultValue: 'في_الانتظار',
    allowNull: false,
    validate: {
      isIn: {
        args: [['في_الانتظار', 'مقبول', 'مرفوض']],
        msg: 'Statut invalide'
      }
    },
    comment: 'Statut du cours (en attente, accepté, refusé)'
  },
  observation: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Observations sur le cours'
  }
}, {
  tableName: 'Cours',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      unique: true,
      fields: ['code_cours']
    },
    {
      fields: ['id_module']
    },
    {
      fields: ['id_enseignant']
    },
    {
      fields: ['status']
    },
    {
      fields: ['titre_fr']
    }
  ],
  hooks: {
    beforeValidate: (cours) => {
      if (cours.code_cours) {
        cours.code_cours = cours.code_cours.toUpperCase().trim();
      }
      if (cours.fichierpdf) {
        cours.fichierpdf = cours.fichierpdf.trim();
      }
    }
  },
  getterMethods: {
    statusFr() {
      const statusMap = {
        'في_الانتظار': 'En attente',
        'مقبول': 'Accepté',
        'مرفوض': 'Refusé'
      };
      return statusMap[this.status] || this.status;
    },
    hasFile() {
      return !!this.fichierpdf;
    }
  }
});

module.exports = Cours;