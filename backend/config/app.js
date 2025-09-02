const APP_CONFIG = {
  // Informations de base de l'application
  name: {
    ar: 'الجودة',
    fr: 'Al-Jawda',
    en: 'Al-Jawda'
  },
  
  fullName: {
    ar: 'الجودة - نظام إدارة التكوين المهني',
    fr: 'Al-Jawda - Système de Gestion de la Formation Professionnelle',
    en: 'Al-Jawda - Professional Training Management System'
  },
  
  description: {
    ar: 'منصة شاملة لإدارة التكوين المهني والتدريب والمتدربين والأساتذة والبرامج التعليمية',
    fr: 'Plateforme complète pour la gestion de la formation professionnelle, de l\'apprentissage, des stagiaires, des enseignants et des programmes éducatifs',
    en: 'Comprehensive platform for managing professional training, learning, trainees, teachers and educational programs'
  },
  
  // Informations institutionnelles
  ministry: {
    ar: 'وزارة التكوين المهني والتعليم العالي والبحث العلمي',
    fr: 'Ministère de la Formation Professionnelle, de l\'Enseignement Supérieur et de la Recherche Scientifique',
    en: 'Ministry of Professional Training, Higher Education and Scientific Research'
  },
  
  // Configuration technique
  version: '1.0.0',
  buildDate: '2024-09-02',
  
  // Configuration du serveur
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    environment: process.env.NODE_ENV || 'development'
  },
  
  // Configuration de la base de données
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    name: process.env.DB_NAME || 'formation_db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  
  // Configuration JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'aljawda-secret-key-2024',
    expiresIn: '24h',
    refreshExpiresIn: '7d'
  },
  
  // Configuration des fichiers
  upload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
    uploadPath: './uploads',
    tempPath: './temp'
  },
  
  // Configuration des emails
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || ''
  },
  
  // Configuration des logs
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: './logs/app.log',
    maxSize: '20m',
    maxFiles: '14d'
  },
  
  // Configuration de sécurité
  security: {
    bcryptRounds: 12,
    maxLoginAttempts: 5,
    lockoutDuration: 15, // minutes
    sessionTimeout: 30, // minutes
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true
    }
  },
  
  // Configuration des fonctionnalités
  features: {
    authentication: true,
    userManagement: true,
    programManagement: true,
    courseManagement: true,
    moduleManagement: true,
    establishmentManagement: true,
    reporting: true,
    fileUpload: true,
    pdfViewer: true,
    emailNotifications: true,
    auditLogging: true
  }
};

// Constantes de l'application
const APP_CONSTANTS = {
  // Rôles utilisateur
  ROLES: {
    ADMIN: 'admin',
    ENSEIGNANT: 'enseignant',
    STAGIAIRE: 'stagiaire',
    ETABLISSEMENT: 'etablissement'
  },
  
  // Statuts des programmes
  PROGRAM_STATUS: {
    ACTIF: 'actif',
    INACTIF: 'inactif',
    EN_REVISION: 'en_revision',
    EN_ATTENTE: 'en_attente'
  },
  
  // Statuts des inscriptions
  INSCRIPTION_STATUS: {
    EN_ATTENTE: 'en_attente',
    ACCEPTEE: 'acceptee',
    REFUSEE: 'refusee'
  },
  
  // Types d'établissements
  ETABLISSEMENT_TYPES: {
    NATIONALE: 'nationale',
    REGIONALE: 'regionale',
    FORMATION: 'formation'
  },
  
  // Messages d'erreur
  ERROR_MESSAGES: {
    UNAUTHORIZED: 'غير مصرح لك بالوصول إلى هذا المورد',
    FORBIDDEN: 'ممنوع الوصول إلى هذا المورد',
    NOT_FOUND: 'المورد المطلوب غير موجود',
    VALIDATION_ERROR: 'بيانات غير صحيحة',
    SERVER_ERROR: 'خطأ في الخادم'
  },
  
  // Messages de succès
  SUCCESS_MESSAGES: {
    CREATED: 'تم الإنشاء بنجاح',
    UPDATED: 'تم التحديث بنجاح',
    DELETED: 'تم الحذف بنجاح',
    LOGIN_SUCCESS: 'تم تسجيل الدخول بنجاح',
    LOGOUT_SUCCESS: 'تم تسجيل الخروج بنجاح'
  }
};

// Configuration des routes
const ROUTES = {
  HOME: '/',
  API: '/api',
  AUTH: '/auth',
  USERS: '/users',
  PROGRAMS: '/programs',
  COURSES: '/courses',
  MODULES: '/modules',
  ESTABLISHMENTS: '/establishments',
  REPORTS: '/reports',
  UPLOAD: '/upload',
  HEALTH: '/health'
};

// Configuration des API endpoints
const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh'
  },
  USERS: '/users',
  PROGRAMS: '/programs',
  COURSES: '/courses',
  MODULES: '/modules',
  ESTABLISHMENTS: '/establishments',
  REPORTS: '/reports',
  UPLOAD: '/upload'
};

module.exports = {
  APP_CONFIG,
  APP_CONSTANTS,
  ROUTES,
  API_ENDPOINTS
};
