const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Ministère de la Formation',
      version: '1.0.0',
      description: 'API complète pour la gestion des formations, programmes, cours et établissements du ministère de la formation',
      contact: {
        name: 'Support API',
        email: 'support@formation.gov.ma'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement'
      },
      {
        url: 'https://api.formation.gov.ma',
        description: 'Serveur de production'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtenu lors de la connexion'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID unique de l\'utilisateur' },
            nom: { type: 'string', description: 'Nom de famille' },
            prenom: { type: 'string', description: 'Prénom' },
            email: { type: 'string', format: 'email', description: 'Adresse email' },
            username: { type: 'string', description: 'Nom d\'utilisateur unique' },
            role: { type: 'string', enum: ['admin', 'enseignant', 'stagiaire', 'etablissement'], description: 'Rôle de l\'utilisateur' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['nom', 'prenom', 'email', 'username', 'role']
        },
        Programme: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID unique du programme' },
            titre: { type: 'string', description: 'Titre du programme' },
            description: { type: 'string', description: 'Description détaillée' },
            duree: { type: 'string', description: 'Durée du programme' },
            status: { type: 'string', enum: ['actif', 'inactif', 'en_revision'], description: 'Statut du programme' },
            dateApprobation: { type: 'string', format: 'date', description: 'Date d\'approbation' },
            etablissementId: { type: 'integer', description: 'ID de l\'établissement' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['titre', 'description', 'duree']
        },
        Cours: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID unique du cours' },
            titre: { type: 'string', description: 'Titre du cours' },
            description: { type: 'string', description: 'Description du cours' },
            duree: { type: 'integer', description: 'Durée en heures' },
            programmeId: { type: 'integer', description: 'ID du programme associé' },
            moduleId: { type: 'integer', description: 'ID du module associé' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['titre', 'description', 'duree']
        },
        Module: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID unique du module' },
            nom: { type: 'string', description: 'Nom du module' },
            description: { type: 'string', description: 'Description du module' },
            duree: { type: 'integer', description: 'Durée en heures' },
            specialiteId: { type: 'integer', description: 'ID de la spécialité' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['nom', 'description', 'duree']
        },
        Etablissement: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID unique de l\'établissement' },
            nom: { type: 'string', description: 'Nom de l\'établissement' },
            type: { type: 'string', enum: ['nationale', 'regionale', 'formation'], description: 'Type d\'établissement' },
            region: { type: 'string', description: 'Région géographique' },
            adresse: { type: 'string', description: 'Adresse complète' },
            telephone: { type: 'string', description: 'Numéro de téléphone' },
            email: { type: 'string', format: 'email', description: 'Email de contact' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['nom', 'type']
        },
        OffreModule: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID unique de l\'offre' },
            nom: { type: 'string', description: 'Nom de l\'offre' },
            description: { type: 'string', description: 'Description de l\'offre' },
            duree: { type: 'integer', description: 'Durée en heures' },
            prix: { type: 'number', description: 'Prix de l\'offre' },
            status: { type: 'string', enum: ['active', 'inactive'], description: 'Statut de l\'offre' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['nom', 'description', 'duree']
        },
        Inscription: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID unique de l\'inscription' },
            stagiaireId: { type: 'integer', description: 'ID du stagiaire' },
            programmeId: { type: 'integer', description: 'ID du programme' },
            dateInscription: { type: 'string', format: 'date', description: 'Date d\'inscription' },
            status: { type: 'string', enum: ['en_attente', 'acceptee', 'refusee'], description: 'Statut de l\'inscription' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['stagiaireId', 'programmeId']
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token d\'accès manquant ou invalide',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Token d\'accès manquant ou invalide' }
                }
              }
            }
          }
        },
        ValidationError: {
          description: 'Données de validation invalides',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Données de validation invalides' },
                  errors: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints d\'authentification et d\'autorisation'
      },
      {
        name: 'Users',
        description: 'Gestion des utilisateurs'
      },
      {
        name: 'Programmes',
        description: 'Gestion des programmes de formation'
      },
      {
        name: 'Cours',
        description: 'Gestion des cours'
      },
      {
        name: 'Modules',
        description: 'Gestion des modules'
      },
      {
        name: 'Etablissements',
        description: 'Gestion des établissements'
      },
      {
        name: 'Offres',
        description: 'Gestion des offres de modules'
      },
      {
        name: 'Inscriptions',
        description: 'Gestion des inscriptions'
      }
    ]
  },
  apis: ['./routes/*.js'] // Fichiers contenant les annotations Swagger
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi: require('swagger-ui-express'),
  swaggerSpec
};
