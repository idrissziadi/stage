// config/database.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'formation_db',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'ziadi',
  
  // Configuration des options
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  
  // Pool de connexions
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  
  // Timezone
  timezone: '+01:00', // UTC+1 pour l'Algérie
  
  // Options Sequelize
  define: {
    timestamps: true, // Active createdAt et updatedAt
    underscored: false, // Utilise camelCase au lieu de snake_case
    freezeTableName: true, // Empêche la pluralisation automatique
  }
});

// Test de connexion
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Connexion à la base de données établie avec succès');
    return true;
  } catch (error) {
    console.error('✗ Erreur de connexion à la base de données:', error.message);
    return false;
  }
};

// Synchronisation de la base de données
const syncDatabase = async (options = {}) => {
  try {
    const syncOptions = {
      force: false, // Ne supprime pas les tables existantes
      alter: false, // Ne modifie pas la structure existante
      ...options
    };
    
    await sequelize.sync(syncOptions);
    console.log('✓ Base de données synchronisée avec succès');
    return true;
  } catch (error) {
    console.error('✗ Erreur lors de la synchronisation:', error.message);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
};