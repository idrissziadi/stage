export const APP_CONFIG = {
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
  
  // URLs et endpoints
  api: {
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://api.aljawda.formation.gov.ma' 
      : 'http://localhost:3000',
    docs: '/api-docs',
    health: '/health'
  },
  
  // Configuration de l'interface
  ui: {
    theme: {
      primary: '#1e40af',
      secondary: '#6b7280',
      accent: '#3b82f6',
      background: '#ffffff',
      text: '#1f2937'
    },
    fonts: {
      primary: 'Cairo, sans-serif',
      secondary: 'Noto Sans Arabic, sans-serif'
    },
    direction: 'rtl',
    language: 'ar'
  },
  
  // Fonctionnalités activées
  features: {
    authentication: true,
    userManagement: true,
    programManagement: true,
    courseManagement: true,
    moduleManagement: true,
    establishmentManagement: true,
    reporting: true,
    fileUpload: true,
    pdfViewer: true
  },
  
  // Configuration de sécurité
  security: {
    jwtExpiry: '24h',
    refreshTokenExpiry: '7d',
    maxLoginAttempts: 5,
    lockoutDuration: 15 // minutes
  },
  
  // Configuration des fichiers
  files: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
    uploadPath: '/uploads'
  },
  
  // Configuration des notifications
  notifications: {
    position: 'top-right',
    duration: 5000,
    maxVisible: 5
  },
  
  // Configuration du cache
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100
  }
};

// Constantes de l'application
export const APP_CONSTANTS = {
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
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  PROGRAMS: '/programs',
  COURSES: '/courses',
  MODULES: '/modules',
  ESTABLISHMENTS: '/establishments',
  REPORTS: '/reports',
  SETTINGS: '/settings'
};

// Configuration des API endpoints
export const API_ENDPOINTS = {
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
  REPORTS: '/reports'
};

export default APP_CONFIG;
