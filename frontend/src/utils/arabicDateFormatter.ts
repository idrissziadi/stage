/**
 * Utilitaire de formatage des dates en arabe standardisé
 * Pour tous les composants de cours - affichage uniforme
 */

// Noms des mois en arabe standardisés
const ARABIC_MONTHS = {
  1: 'جانفي',
  2: 'فيفري', 
  3: 'مارس',
  4: 'أفريل',
  5: 'ماي',
  6: 'جوان',
  7: 'جويلية',
  8: 'أوت',        // ✅ Standardisé : "أوت" au lieu de "أغسطس"
  9: 'سبتمبر',
  10: 'أكتوبر',
  11: 'نوفمبر',
  12: 'ديسمبر'
};

// Noms des mois en arabe alternatifs (pour compatibilité)
const ARABIC_MONTHS_ALTERNATIVE = {
  1: 'يناير',
  2: 'فبراير',
  3: 'مارس',
  4: 'أبريل',
  5: 'مايو',
  6: 'يونيو',
  7: 'يوليو',
  8: 'أغسطس',      // ❌ Ancien format à remplacer
  9: 'سبتمبر',
  10: 'أكتوبر',
  11: 'نوفمبر',
  12: 'ديسمبر'
};

/**
 * Vérifie si une date est valide
 */
export const isValidDate = (date: any): boolean => {
  if (!date) return false;
  
  try {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime()) && dateObj.getTime() > 0;
  } catch {
    return false;
  }
};

/**
 * Formate une date en arabe standardisé
 * @param dateInput - La date à formater
 * @returns La date formatée en arabe (ex: "20 أوت 2025")
 */
export const formatDateToArabic = (dateInput: string | Date | number | null | undefined): string => {
  if (!dateInput) {
    return 'غير محدد';
  }

  try {
    let date: Date;

    // Gestion des différents types d'entrée
    if (typeof dateInput === 'string') {
      // Essayer différents formats de date
      if (dateInput.includes('T')) {
        // Format ISO
        date = new Date(dateInput);
      } else if (dateInput.includes('-')) {
        // Format MySQL (YYYY-MM-DD)
        date = new Date(dateInput);
      } else if (dateInput.includes('/')) {
        // Format avec slashes
        date = new Date(dateInput);
      } else {
        // Timestamp ou autre format
        date = new Date(parseInt(dateInput));
      }
    } else if (typeof dateInput === 'number') {
      // Timestamp
      date = new Date(dateInput);
    } else {
      // Objet Date
      date = dateInput;
    }

    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      console.warn('Date invalide:', dateInput);
      return 'غير محدد';
    }

    // Extraire les composants de la date
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() retourne 0-11
    const year = date.getFullYear();

    // Formater en arabe standardisé
    const arabicMonth = ARABIC_MONTHS[month as keyof typeof ARABIC_MONTHS];
    
    if (!arabicMonth) {
      console.warn('Mois invalide:', month);
      return 'غير محدد';
    }

    return `${day} ${arabicMonth} ${year}`;
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return 'غير محدد';
  }
};

/**
 * Formate une date avec l'heure en arabe
 * @param dateInput - La date à formater
 * @returns La date avec l'heure formatée en arabe
 */
export const formatDateTimeToArabic = (dateInput: string | Date | number | null | undefined): string => {
  if (!dateInput) {
    return 'غير محدد';
  }

  try {
    const date = new Date(dateInput);
    
    if (isNaN(date.getTime())) {
      return 'غير محدد';
    }

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const arabicMonth = ARABIC_MONTHS[month as keyof typeof ARABIC_MONTHS];
    
    if (!arabicMonth) {
      return 'غير محدد';
    }

    return `${day} ${arabicMonth} ${year} - ${hours}:${minutes}`;
  } catch (error) {
    console.error('Erreur lors du formatage de la date avec heure:', error);
    return 'غير محدد';
  }
};

/**
 * Formate une date relative en arabe
 * @param dateInput - La date à formater
 * @returns Le temps écoulé en arabe (ex: "منذ 3 ساعات")
 */
export const formatRelativeDateToArabic = (dateInput: string | Date | number | null | undefined): string => {
  if (!dateInput) {
    return 'غير محدد';
  }

  try {
    const date = new Date(dateInput);
    
    if (isNaN(date.getTime())) {
      return 'غير محدد';
    }

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      if (diffInDays === 1) {
        return 'أمس';
      } else if (diffInDays < 7) {
        return `منذ ${diffInDays} أيام`;
      } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return `منذ ${weeks} أسابيع`;
      } else if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        return `منذ ${months} أشهر`;
      } else {
        const years = Math.floor(diffInDays / 365);
        return `منذ ${years} سنوات`;
      }
    } else if (diffInHours > 0) {
      if (diffInHours === 1) {
        return 'منذ ساعة واحدة';
      } else {
        return `منذ ${diffInHours} ساعات`;
      }
    } else if (diffInMinutes > 0) {
      if (diffInMinutes === 1) {
        return 'منذ دقيقة واحدة';
      } else {
        return `منذ ${diffInMinutes} دقائق`;
      }
    } else {
      return 'الآن';
    }
  } catch (error) {
    console.error('Erreur lors du formatage de la date relative:', error);
    return 'غير محدد';
  }
};

/**
 * Formate une date de cours en arabe standardisé
 * @param course - L'objet cours
 * @returns La date formatée en arabe
 */
export const formatCourseDateToArabic = (course: any): string => {
  // Essayer différents champs de date dans l'ordre de priorité
  const possibleDateFields = ['updatedAt', 'updated_at', 'createdAt', 'created_at', 'date_creation', 'date_upload'];
  
  for (const field of possibleDateFields) {
    const dateValue = course[field];
    if (dateValue && isValidDate(dateValue)) {
      return formatDateToArabic(dateValue);
    }
  }
  
  // Si aucune date valide n'est trouvée
  return 'غير محدد';
};

/**
 * Formate une date d'approbation en arabe
 * @param item - L'objet (cours, mémoire, etc.)
 * @returns La date d'approbation formatée en arabe
 */
export const formatApprovalDateToArabic = (item: any): string => {
  // Priorité aux dates de mise à jour (approbation)
  const approvalDate = item.updatedAt || item.updated_at;
  
  if (approvalDate && isValidDate(approvalDate)) {
    return formatDateToArabic(approvalDate);
  }
  
  // Fallback sur la date de création
  const creationDate = item.createdAt || item.created_at;
  if (creationDate && isValidDate(creationDate)) {
    return formatDateToArabic(creationDate);
  }
  
  return 'غير محدد';
};

/**
 * Formate une date de création en arabe
 * @param item - L'objet (cours, mémoire, etc.)
 * @returns La date de création formatée en arabe
 */
export const formatCreationDateToArabic = (item: any): string => {
  const creationDate = item.createdAt || item.created_at;
  
  if (creationDate && isValidDate(creationDate)) {
    return formatDateToArabic(creationDate);
  }
  
  return 'غير محدد';
};

/**
 * Formate une date avec validation robuste
 * @param dateInput - La date à formater
 * @param fallback - Valeur de fallback si la date est invalide
 * @returns La date formatée ou la valeur de fallback
 */
export const formatDateSafe = (
  dateInput: string | Date | number | null | undefined, 
  fallback: string = 'غير محدد'
): string => {
  try {
    if (!dateInput) {
      return fallback;
    }
    
    const result = formatDateToArabic(dateInput);
    return result === 'غير محدد' ? fallback : result;
  } catch (error) {
    console.error('Erreur lors du formatage sécurisé de la date:', error);
    return fallback;
  }
};

/**
 * Vérifie et remplace les anciens formats de mois
 * @param text - Le texte à vérifier
 * @returns Le texte avec les mois standardisés
 */
export const standardizeMonthNames = (text: string): string => {
  let standardizedText = text;
  
  // Remplacer les anciens formats par les nouveaux
  Object.entries(ARABIC_MONTHS_ALTERNATIVE).forEach(([monthNum, oldMonth]) => {
    const newMonth = ARABIC_MONTHS[parseInt(monthNum) as keyof typeof ARABIC_MONTHS];
    if (newMonth && oldMonth !== newMonth) {
      standardizedText = standardizedText.replace(new RegExp(oldMonth, 'g'), newMonth);
    }
  });
  
  return standardizedText;
};

// Export par défaut pour compatibilité
export default {
  formatDateToArabic,
  formatDateTimeToArabic,
  formatRelativeDateToArabic,
  formatCourseDateToArabic,
  formatApprovalDateToArabic,
  formatCreationDateToArabic,
  formatDateSafe,
  standardizeMonthNames,
  isValidDate
};
