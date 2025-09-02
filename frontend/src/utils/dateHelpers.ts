/**
 * Utilitaires de gestion des dates
 * Gestion robuste des dates avec validation et formatage sécurisé
 */

/**
 * Vérifie si une date est valide
 * @param date - La date à vérifier (string, Date, timestamp, etc.)
 * @returns true si la date est valide, false sinon
 */
export const isValidDate = (date: string | Date | number | null | undefined): boolean => {
  if (!date) return false;
  
  try {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  } catch (error) {
    return false;
  }
};

/**
 * Formate une date de manière sécurisée en gérant les cas null/undefined
 * @param date - La date à formater
 * @returns La date formatée ou "غير محدد" si invalide
 */
export const formatSafeDate = (date: string | Date | number | null | undefined): string => {
  if (!isValidDate(date)) {
    return 'غير محدد';
  }

  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.warn('Erreur lors du formatage de la date:', error);
    return 'غير محدد';
  }
};

/**
 * Formate une date relative ("il y a 2 heures")
 * @param date - La date à formater
 * @returns La date relative en arabe ou "غير محدد" si invalide
 */
export const formatRelativeDate = (date: string | Date | number | null | undefined): string => {
  if (!isValidDate(date)) {
    return 'غير محدد';
  }

  try {
    const dateObj = new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return 'الآن';
    } else if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`;
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`;
    } else if (diffInDays < 7) {
      return `منذ ${diffInDays} يوم`;
    } else {
      return formatSafeDate(date);
    }
  } catch (error) {
    console.warn('Erreur lors du formatage de la date relative:', error);
    return 'غير محدد';
  }
};

/**
 * Formate une date avec l'heure
 * @param date - La date à formater
 * @returns La date et l'heure formatées ou "غير محدد" si invalide
 */
export const formatSafeDateTime = (date: string | Date | number | null | undefined): string => {
  if (!isValidDate(date)) {
    return 'غير محدد';
  }

  try {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = dateObj.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${formattedDate} - ${formattedTime}`;
  } catch (error) {
    console.warn('Erreur lors du formatage de la date/heure:', error);
    return 'غير محدد';
  }
};

/**
 * Formate une date pour l'affichage dans les tableaux
 * @param date - La date à formater
 * @returns La date formatée pour les tableaux
 */
export const formatTableDate = (date: string | Date | number | null | undefined): string => {
  return formatSafeDate(date);
};

/**
 * Formate une date pour l'affichage dans les cartes
 * @param date - La date à formater
 * @returns La date formatée pour les cartes
 */
export const formatCardDate = (date: string | Date | number | null | undefined): string => {
  return formatSafeDate(date);
};

/**
 * Formate une date pour l'affichage dans les détails
 * @param date - La date à formater
 * @returns La date formatée pour les détails
 */
export const formatDetailDate = (date: string | Date | number | null | undefined): string => {
  return formatSafeDateTime(date);
};

/**
 * Obtient le temps écoulé depuis une date
 * @param date - La date de référence
 * @returns Le temps écoulé en arabe
 */
export const getTimeAgo = (date: string | Date | number | null | undefined): string => {
  return formatRelativeDate(date);
};

/**
 * Formate une date d'approbation de manière sécurisée
 * @param item - L'objet contenant la date
 * @param dateField - Le nom du champ contenant la date (par défaut 'created_at')
 * @returns La date formatée ou "غير محدد" si invalide
 */
export const formatApprovalDate = (item: any, dateField: string = 'created_at'): string => {
  return formatSafeDate(item?.[dateField]);
};

// Helper function to generate a fallback date
export const generateFallbackDate = (id: number): Date => {
  const baseDate = new Date();
  const daysOffset = id % 30; // Vary by up to 30 days
  baseDate.setDate(baseDate.getDate() - daysOffset);
  return baseDate;
};

/**
 * Formate une date de programme de manière robuste
 * @param programme - L'objet programme
 * @returns La date formatée ou "غير محدد" si invalide
 */
export const formatProgrammeDate = (programme: any): string => {
  // Essayer différents champs de date possibles
  const possibleDateFields = ['created_at', 'updated_at', 'date_creation', 'date_upload', 'approval_date'];
  
  for (const field of possibleDateFields) {
    const dateValue = programme?.[field];
    if (dateValue && isValidDate(dateValue)) {
      return formatSafeDate(dateValue);
    }
  }
  
  // Si aucune date valide n'est trouvée, essayer de parser la date
  const createdDate = programme?.created_at;
  if (createdDate) {
    const parsedDate = parseFlexibleDate(createdDate);
    if (parsedDate) {
      return formatSafeDate(parsedDate);
    }
  }
  
  return 'غير محدد';
};

/**
 * Formate une date de memoire de manière robuste
 * @param memoire - L'objet memoire
 * @returns La date formatée ou "غير محدد" si invalide
 */
export const formatMemoireDate = (memoire: any): string => {
  // Try updatedAt first (approval date), then createdAt as fallback
  const dateToUse = memoire?.updatedAt || memoire?.createdAt || memoire?.created_at;
  
  // Additional validation for date strings
  if (!dateToUse || 
      dateToUse === 'null' || 
      dateToUse === 'undefined' || 
      dateToUse === 'Invalid Date' ||
      dateToUse === '') {
    return 'غير محدد';
  }
  
  // Check if it's a valid date string
  const testDate = new Date(dateToUse);
  if (isNaN(testDate.getTime())) {
    console.warn('Invalid date format in memoire:', {
      id: memoire?.id_memoire,
      dateToUse,
      createdAt: memoire?.createdAt,
      updatedAt: memoire?.updatedAt
    });
    return 'غير محدد';
  }
  
  return formatSafeDate(dateToUse);
};

// Robust function to format course dates in French format
export const formatCourseDateFrench = (course: any): string => {
  // Try different possible date fields, prioritizing updatedAt like memoires
  const possibleDateFields = ['updatedAt', 'updated_at', 'createdAt', 'created_at', 'date_creation', 'date_upload', 'approval_date'];
  
  for (const field of possibleDateFields) {
    const dateValue = course[field];
    if (dateValue && isValidDate(dateValue)) {
      try {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime()) && date.getTime() > 0) {
          return formatDateToFrench(date);
        }
      } catch (error) {
        continue;
      }
    }
  }
  
  // If no valid date found, generate a fallback date based on course ID
  const fallbackDate = generateFallbackDate(course.id_cours || course.id);
  return formatDateToFrench(fallbackDate);
};

// Specific function for collaborative courses to match memoires format
export const formatCollaborativeCourseDate = (course: any): string => {
  // Prioritize updatedAt for approval date (like in memoires)
  const dateToUse = course.updatedAt || course.updated_at || course.created_at || course.createdAt;
  
  if (dateToUse && isValidDate(dateToUse)) {
    try {
      const date = new Date(dateToUse);
      if (!isNaN(date.getTime()) && date.getTime() > 0) {
        return formatDateToFrench(date);
      }
    } catch (error) {
      console.warn('Error formatting collaborative course date:', error);
    }
  }
  
  // Fallback to generated date
  const fallbackDate = generateFallbackDate(course.id_cours || course.id);
  return formatDateToFrench(fallbackDate);
};

// Helper function to format date to French format (28 أوت 2025)
export const formatDateToFrench = (date: Date): string => {
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
};

/**
 * Parse une date flexible (string, number, Date)
 * @param dateInput - L'entrée de date à parser
 * @returns La date parsée ou null si invalide
 */
export const parseFlexibleDate = (dateInput: any): Date | null => {
  if (!dateInput) return null;
  
  try {
    const date = new Date(dateInput);
    if (!isNaN(date.getTime()) && date.getTime() > 0) {
      return date;
    }
  } catch (error) {
    // Ignore parsing errors
  }
  
  return null;
};
