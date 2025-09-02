/**
 * Utilitaire de normalisation des dates
 * Convertit toutes les dates en format arabe uniforme
 */

// Noms des mois en arabe
const ARABIC_MONTHS = {
  1: 'جانفي',
  2: 'فيفري',
  3: 'مارس',
  4: 'أفريل',
  5: 'ماي',
  6: 'جوان',
  7: 'جويلية',
  8: 'أوت',
  9: 'سبتمبر',
  10: 'أكتوبر',
  11: 'نوفمبر',
  12: 'ديسمبر'
};

/**
 * Normalise une date en format arabe uniforme
 * @param dateInput - La date à formater (string, Date, timestamp, etc.)
 * @returns La date formatée en arabe (ex: "20 جوان 1985")
 */
export const formatDate = (dateInput: string | Date | number | null | undefined): string => {
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

    // Formater en arabe
    const arabicMonth = ARABIC_MONTHS[month as keyof typeof ARABIC_MONTHS];
    
    if (!arabicMonth) {
      console.warn('Mois invalide:', month);
      return 'غير محدد';
    }

    return `${day} ${arabicMonth} ${year}`;
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error, 'Input:', dateInput);
    return 'غير محدد';
  }
};

/**
 * Formate une date avec l'heure
 * @param dateInput - La date à formater
 * @returns La date et l'heure formatées en arabe
 */
export const formatDateTime = (dateInput: string | Date | number | null | undefined): string => {
  if (!dateInput) {
    return 'غير محدد';
  }

  try {
    let date: Date;

    if (typeof dateInput === 'string') {
      if (dateInput.includes('T')) {
        date = new Date(dateInput);
      } else if (dateInput.includes('-')) {
        date = new Date(dateInput);
      } else if (dateInput.includes('/')) {
        date = new Date(dateInput);
      } else {
        date = new Date(parseInt(dateInput));
      }
    } else if (typeof dateInput === 'number') {
      date = new Date(dateInput);
    } else {
      date = dateInput;
    }

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
    console.error('Erreur lors du formatage de la date/heure:', error);
    return 'غير محدد';
  }
};

/**
 * Formate une date relative (il y a X temps)
 * @param dateInput - La date à formater
 * @returns La date relative en arabe
 */
export const formatRelativeDate = (dateInput: string | Date | number | null | undefined): string => {
  if (!dateInput) {
    return 'غير محدد';
  }

  try {
    let date: Date;

    if (typeof dateInput === 'string') {
      if (dateInput.includes('T')) {
        date = new Date(dateInput);
      } else if (dateInput.includes('-')) {
        date = new Date(dateInput);
      } else if (dateInput.includes('/')) {
        date = new Date(dateInput);
      } else {
        date = new Date(parseInt(dateInput));
      }
    } else if (typeof dateInput === 'number') {
      date = new Date(dateInput);
    } else {
      date = dateInput;
    }

    if (isNaN(date.getTime())) {
      return 'غير محدد';
    }

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
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
      return formatDate(dateInput);
    }
  } catch (error) {
    console.error('Erreur lors du formatage de la date relative:', error);
    return 'غير محدد';
  }
};

/**
 * Formate une date pour l'affichage dans les tableaux
 * @param dateInput - La date à formater
 * @returns La date formatée pour les tableaux
 */
export const formatTableDate = (dateInput: string | Date | number | null | undefined): string => {
  return formatDate(dateInput);
};

/**
 * Formate une date pour l'affichage dans les cartes
 * @param dateInput - La date à formater
 * @returns La date formatée pour les cartes
 */
export const formatCardDate = (dateInput: string | Date | number | null | undefined): string => {
  return formatDate(dateInput);
};

/**
 * Formate une date pour l'affichage dans les détails
 * @param dateInput - La date à formater
 * @returns La date formatée pour les détails
 */
export const formatDetailDate = (dateInput: string | Date | number | null | undefined): string => {
  return formatDateTime(dateInput);
};
