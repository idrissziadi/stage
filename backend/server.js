// server.js
require('dotenv').config();
const express = require('express');
const { sequelize } = require('./config/database');
const setupAssociations = require('./models/associations');

// Import des modèles (juste pour les enregistrer)
require('./models/Compte');
require('./models/Enseignant');
require('./models/Stagiaire');
require('./models/EtablissementFormation');
require('./models/EtablissementRegionale');
require('./models/EtablissementNationale');
require('./models/Branche');
require('./models/Specialite');
require('./models/Module');
require('./models/Cours');
require('./models/Memoire');
require('./models/Programme');
require('./models/Offre');
require('./models/Inscription');
require('./models/SpecialiteEtab');
require('./models/Ens_Module');
require('./models/Grade');
require('./models/Mode_Formation');
require('./models/Diplome');
require('./models/TokenBlacklist');

// Mise en place des associations
setupAssociations();

// Initialisation du serveur
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Servir les fichiers statiques
app.use('/upload', express.static('upload'));

// Import de la configuration
const { APP_CONFIG } = require('./config/app');

// Test route
app.get('/', (req, res) => {
  res.json({
    message: `${APP_CONFIG.name.ar} - API du ministère de la formation fonctionne ✅`,
    app: APP_CONFIG.name,
    version: APP_CONFIG.version,
    ministry: APP_CONFIG.ministry.ar
  });
});

// Swagger UI
const { swaggerUi, swaggerSpec } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes d'authentification
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Routes utilisateur
const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

// Routes cours
const coursRoutes = require('./routes/coursRoutes');
app.use('/cours', coursRoutes);

// Routes mémoire
const memoireRoutes = require('./routes/memoireRoutes');
app.use('/memoire', memoireRoutes);

// Routes offre
const offreRoutes = require('./routes/offreRoutes');
app.use('/offre', offreRoutes);

// Routes inscription
const inscriptionRoutes = require('./routes/inscriptionRoutes');
app.use('/inscription', inscriptionRoutes);

// Routes module
const moduleRoutes = require('./routes/moduleRoutes');
app.use('/module', moduleRoutes);

// Routes spécialité
const specialiteRoutes = require('./routes/specialiteRoutes');
app.use('/specialite', specialiteRoutes);

// Routes branche
const brancheRoutes = require('./routes/brancheRoutes');
app.use('/branche', brancheRoutes);

// Routes programme
const programmeRoutes = require('./routes/programmeRoutes');
app.use('/programme', programmeRoutes);

// Routes établissement
const etablissementRoutes = require('./routes/etablissementRoutes');
app.use('/etablissement', etablissementRoutes);

// Routes établissement régionale
const etablissementRegionaleRoutes = require('./routes/etablissementRegionaleRoutes');
app.use('/api/etablissement-regionale', etablissementRegionaleRoutes);

// Routes assignation module-enseignant
const ensModuleRoutes = require('./routes/ensModuleRoutes');
app.use('/ens-module', ensModuleRoutes);

// Routes auxiliary (grades, specialites, diplomes, etc.)
const auxiliaryRoutes = require('./routes/auxiliaryRoutes');
app.use('/', auxiliaryRoutes);

// Synchronisation Sequelize
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie ✅');

    // Use force: false and alter: false to avoid index conflicts
    // Only sync if tables don't exist
    const tableExists = await sequelize.getQueryInterface().showAllTables();
    
    if (tableExists.length === 0) {
      console.log('Creating tables for the first time...');
      await sequelize.sync({ force: false });
      console.log('Toutes les tables ont été créées avec succès ✅');
    } else {
      console.log('Tables already exist, skipping sync to avoid index conflicts ✅');
      console.log('If you need to update schema, use the reset-database.js script');
    }

    // Démarrage du serveur
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 ${APP_CONFIG.name.ar} - Serveur démarré sur le port ${PORT}`);
      console.log(`📚 Documentation API disponible sur http://localhost:${PORT}/api-docs`);
      console.log(`🏛️ ${APP_CONFIG.ministry.ar}`);
      console.log(`✨ Version: ${APP_CONFIG.version}`);
    });
  } catch (error) {
    console.error('Erreur lors de la connexion ou de la synchronisation :', error);
    if (error.name === 'SequelizeDatabaseError' && error.parent?.code === 'ER_TOO_MANY_KEYS') {
      console.error('\n💡 Solution suggérée:');
      console.error('Lancez: node reset-database.js pour réinitialiser la base de données');
    }
  }
};

startServer();
