const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Compte = require('../models/Compte');
const Stagiaire = require('../models/Stagiaire');
const Enseignant = require('../models/Enseignant');
const EtablissementFormation = require('../models/EtablissementFormation');
const EtablissementRegionale = require('../models/EtablissementRegionale');
const TokenBlacklist = require('../models/TokenBlacklist');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS || 10);

function signToken(payload, options = {}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN, ...options });
}

function getTokenExpiryDate(token) {
  const decoded = jwt.decode(token);
  if (!decoded || !decoded.exp) return null;
  return new Date(decoded.exp * 1000);
}

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

const AuthController = {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'username et password sont requis' });
      }

      const compte = await Compte.findOne({ where: { username } });
      if (!compte) {
        return res.status(401).json({ message: 'Identifiants invalides' });
      }

      const match = await bcrypt.compare(password, compte.password);
      if (!match) {
        return res.status(401).json({ message: 'Identifiants invalides' });
      }

      // Payload de base
      let tokenPayload = { 
        id_compte: compte.id_compte, 
        role: compte.role, 
        username: compte.username 
      };

      // Ajouter l'ID spécifique selon le rôle
      if (compte.role === 'EtablissementRegionale') {
        const etablissement = await EtablissementRegionale.findOne({ 
          where: { compte_id: compte.id_compte } 
        });
        if (etablissement) {
          tokenPayload.id_etab_regionale = etablissement.id_etab_regionale;
        }
      } else if (compte.role === 'Enseignant') {
        const enseignant = await Enseignant.findOne({ 
          where: { compte_id: compte.id_compte } 
        });
        if (enseignant) {
          tokenPayload.id_enseignant = enseignant.id_enseignant;
        }
      } else if (compte.role === 'EtablissementFormation') {
        const etablissement = await EtablissementFormation.findOne({ 
          where: { compte_id: compte.id_compte } 
        });
        if (etablissement) {
          tokenPayload.id_etab_formation = etablissement.id_etab_formation;
        }
      } else if (compte.role === 'Stagiaire') {
        const stagiaire = await Stagiaire.findOne({ 
          where: { compte_id: compte.id_compte } 
        });
        if (stagiaire) {
          tokenPayload.id_stagiaire = stagiaire.id_stagiaire;
        }
      }

      const token = signToken(tokenPayload);
      return res.json({ role: compte.role, token });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async logout(req, res) {
    try {
      const authHeader = req.headers.authorization || '';
      const rawToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
      if (!rawToken) {
        return res.status(400).json({ message: 'Token manquant' });
      }
      const expiresAt = getTokenExpiryDate(rawToken);
      if (!expiresAt) {
        return res.status(400).json({ message: 'Token invalide' });
      }
      await TokenBlacklist.create({ tokenHash: sha256Hex(rawToken), expiresAt });
      return res.json({ message: 'Déconnexion réussie' });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async registerStagiaire(req, res) {
    try {
      // Autorisé seulement pour EtablissementFormation (middleware vérifie déjà)
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'username et password sont requis' });
      }

      const exists = await Compte.findOne({ where: { username } });
      if (exists) {
        return res.status(409).json({ message: 'Nom d\'utilisateur déjà pris' });
      }

      const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const newCompte = await Compte.create({ username, password: hashed, role: 'Stagiaire' });
      const created = await Stagiaire.create({ compte_id: newCompte.id_compte });
      return res.status(201).json({ id_compte: newCompte.id_compte, id_stagiaire: created.id_stagiaire });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async registerEnseignant(req, res) {
    try {
      // Autorisé seulement pour EtablissementFormation (middleware vérifie déjà)
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'username et password sont requis' });
      }

      const exists = await Compte.findOne({ where: { username } });
      if (exists) {
        return res.status(409).json({ message: 'Nom d\'utilisateur déjà pris' });
      }

      const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const newCompte = await Compte.create({ username, password: hashed, role: 'Enseignant' });
      
      // Create the Enseignant record
      const enseignant = await Enseignant.create({ 
        compte_id: newCompte.id_compte,
        nom_fr: null,
        prenom_fr: null,
        // id_grade and id_etab_formation are now nullable
      });
      
      return res.status(201).json({ 
        id_compte: newCompte.id_compte, 
        id_enseignant: enseignant.id_enseignant 
      });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async changerMotDePasse(req, res) {
    try {
      const { userId, oldPassword, newPassword } = req.body;
      if (!userId || !oldPassword || !newPassword) {
        return res.status(400).json({ message: 'userId, oldPassword, newPassword requis' });
      }
      const compte = await Compte.findByPk(userId);
      if (!compte) {
        return res.status(404).json({ message: 'Compte introuvable' });
      }
      const match = await bcrypt.compare(oldPassword, compte.password);
      if (!match) {
        return res.status(401).json({ message: 'Ancien mot de passe incorrect' });
      }
      const hashed = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
      compte.password = hashed;
      await compte.save();
      return res.json({ message: 'Mot de passe changé avec succès' });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async signup(req, res) {
    try {
      const { username, password, role } = req.body;
      if (!username || !password || !role) {
        return res.status(400).json({ message: 'username, password, role requis' });
      }

      const allowedRoles = ['Stagiaire', 'Enseignant', 'EtablissementFormation', 'EtablissementRegionale', 'EtablissementNationale'];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Rôle invalide' });
      }

      const exists = await Compte.findOne({ where: { username } });
      if (exists) {
        return res.status(409).json({ message: 'Nom d\'utilisateur déjà pris' });
      }

      const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const newCompte = await Compte.create({ username, password: hashed, role });

      if (role === 'Stagiaire') {
        const created = await Stagiaire.create({ compte_id: newCompte.id_compte });
        return res.status(201).json({ id_compte: newCompte.id_compte, id_stagiaire: created.id_stagiaire });
      }
      
      if (role === 'Enseignant') {
        const created = await Enseignant.create({ compte_id: newCompte.id_compte });
        return res.status(201).json({ id_compte: newCompte.id_compte, id_enseignant: created.id_enseignant });
      }

      // For other roles, creating the profile requires additional mandatory fields
      return res.status(201).json({ id_compte: newCompte.id_compte });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Password recovery functionality
  async initiatePasswordReset(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'Email requis' });
      }

      // Find user by email in different profile tables
      let userProfile = null;
      let accountId = null;
      let role = null;

      // Check Stagiaire
      const stagiaire = await Stagiaire.findOne({ 
        where: { email },
        include: [{ model: Compte, as: 'Compte' }]
      });
      if (stagiaire) {
        userProfile = stagiaire;
        accountId = stagiaire.compte_id;
        role = 'Stagiaire';
      }

      // Check Enseignant if not found in Stagiaire
      if (!userProfile) {
        const enseignant = await Enseignant.findOne({ 
          where: { email },
          include: [{ model: Compte, as: 'Compte' }]
        });
        if (enseignant) {
          userProfile = enseignant;
          accountId = enseignant.compte_id;
          role = 'Enseignant';
        }
      }

      // Check EtablissementFormation if not found
      if (!userProfile) {
        const etablissement = await EtablissementFormation.findOne({ 
          where: { email },
          include: [{ model: Compte, as: 'Compte' }]
        });
        if (etablissement) {
          userProfile = etablissement;
          accountId = etablissement.compte_id;
          role = 'EtablissementFormation';
        }
      }

      if (!userProfile) {
        // Return success message even if email not found (security measure)
        return res.json({ 
          message: 'Si cet email existe dans notre système, vous recevrez un lien de réinitialisation' 
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = sha256Hex(resetToken);
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      // Store reset token (you'll need to create a PasswordReset model)
      // For now, we'll use a simple approach - store in a temp table or memory
      // In production, you should create a proper PasswordReset model
      
      // Create a temporary solution using TokenBlacklist table (repurposed)
      await TokenBlacklist.create({
        tokenHash: resetTokenHash,
        expiresAt: resetTokenExpiry,
        // Store account ID in a way that can be retrieved
        // This is a temporary solution
      });

      // In a real application, you would send an email here
      // For now, return the reset token (only for development/testing)
      return res.json({ 
        message: 'Lien de réinitialisation envoyé par email',
        // Remove this in production - only for testing
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
        accountId: process.env.NODE_ENV === 'development' ? accountId : undefined
      });
    } catch (error) {
      console.error('Error in password reset initiation:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async resetPassword(req, res) {
    try {
      const { resetToken, newPassword, accountId } = req.body;
      if (!resetToken || !newPassword || !accountId) {
        return res.status(400).json({ message: 'Token de réinitialisation, nouveau mot de passe et ID de compte requis' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
      }

      const resetTokenHash = sha256Hex(resetToken);
      
      // Find the reset token (this is a simplified approach)
      const tokenRecord = await TokenBlacklist.findOne({
        where: {
          tokenHash: resetTokenHash,
          expiresAt: { [require('sequelize').Op.gt]: new Date() }
        }
      });

      if (!tokenRecord) {
        return res.status(400).json({ message: 'Token de réinitialisation invalide ou expiré' });
      }

      // Find the account
      const compte = await Compte.findByPk(accountId);
      if (!compte) {
        return res.status(404).json({ message: 'Compte introuvable' });
      }

      // Update password
      const hashed = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
      compte.password = hashed;
      await compte.save();

      // Delete the reset token
      await tokenRecord.destroy();

      return res.json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
      console.error('Error in password reset:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Enhanced session management
  async validateSession(req, res) {
    try {
      // This endpoint validates if the current session is still valid
      // The middleware already validates the token, so if we reach here, it's valid
      const { id_compte, role, username } = req.user;
      
      // Check if account still exists and is active
      const compte = await Compte.findByPk(id_compte);
      if (!compte) {
        return res.status(401).json({ message: 'Compte introuvable' });
      }

      return res.json({ 
        valid: true,
        user: {
          id_compte,
          role,
          username
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async refreshToken(req, res) {
    try {
      // Generate a new token with extended expiry
      const { id_compte, role, username } = req.user;
      
      // Verify account still exists
      const compte = await Compte.findByPk(id_compte);
      if (!compte) {
        return res.status(401).json({ message: 'Compte introuvable' });
      }

      // Generate new token
      const newToken = signToken({ id_compte, role, username });
      
      // Optionally blacklist the old token
      const authHeader = req.headers.authorization || '';
      const oldToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
      if (oldToken) {
        const expiresAt = getTokenExpiryDate(oldToken);
        if (expiresAt) {
          await TokenBlacklist.create({ tokenHash: sha256Hex(oldToken), expiresAt });
        }
      }

      return res.json({ 
        token: newToken,
        message: 'Token rafraîci avec succès'
      });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Nouvelle méthode pour créer un établissement de formation avec stagiaire et inscription automatiques
  async signupEtablissementFormation(req, res) {
    try {
      const { 
        username, 
        password, 
        nom_fr, 
        nom_ar, 
        adresse_fr, 
        adresse_ar, 
        email, 
        telephone,
        // Données du stagiaire
        stagiaire_nom_fr,
        stagiaire_nom_ar,
        stagiaire_prenom_fr,
        stagiaire_prenom_ar,
        stagiaire_date_naissance,
        stagiaire_email,
        stagiaire_telephone,
        // Données de l'offre (optionnelles, on utilisera la première disponible si non fournies)
        id_specialite,
        id_diplome,
        id_mode
      } = req.body;

      // Validation des champs obligatoires
      if (!username || !password || !nom_fr || !nom_ar) {
        return res.status(400).json({ 
          message: 'username, password, nom_fr, nom_ar sont requis' 
        });
      }

      // Vérifier si le nom d'utilisateur existe déjà
      const exists = await Compte.findOne({ where: { username } });
      if (exists) {
        return res.status(409).json({ message: 'Nom d\'utilisateur déjà pris' });
      }

      // Vérifier si l'email de l'établissement existe déjà
      if (email) {
        const emailExists = await EtablissementFormation.findOne({ where: { email } });
        if (emailExists) {
          return res.status(409).json({ message: 'Cet email est déjà utilisé par un autre établissement' });
        }
      }

      // Vérifier si l'email du stagiaire existe déjà
      if (stagiaire_email) {
        const stagiaireEmailExists = await Stagiaire.findOne({ where: { email: stagiaire_email } });
        if (stagiaireEmailExists) {
          return res.status(409).json({ message: 'Cet email est déjà utilisé par un autre stagiaire' });
        }
      }

      // Créer le compte
      const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const newCompte = await Compte.create({ 
        username, 
        password: hashed, 
        role: 'EtablissementFormation' 
      });

      // Créer l'établissement de formation
      const etablissement = await EtablissementFormation.create({
        code: username.toUpperCase().substring(0, 10), // Code basé sur le username
        nom_fr,
        nom_ar,
        adresse_fr: adresse_fr || null,
        adresse_ar: adresse_ar || null,
        email: email || null,
        telephone: telephone || null,
        compte_id: newCompte.id_compte
      });

      // Créer le stagiaire
      const stagiaire = await Stagiaire.create({
        nom_fr: stagiaire_nom_fr || 'Stagiaire',
        nom_ar: stagiaire_nom_ar || 'متدرب',
        prenom_fr: stagiaire_prenom_fr || 'Par défaut',
        prenom_ar: stagiaire_prenom_ar || 'افتراضي',
        date_naissance: stagiaire_date_naissance || null,
        email: stagiaire_email || null,
        telephone: stagiaire_telephone || null,
        compte_id: null // Pas de compte pour ce stagiaire par défaut
      });

      // Trouver une offre disponible pour cet établissement
      let offre = null;
      
      if (id_specialite && id_diplome && id_mode) {
        // Utiliser les paramètres fournis
        offre = await Offre.findOne({
          where: {
            id_specialite: parseInt(id_specialite),
            id_diplome: parseInt(id_diplome),
            id_mode: parseInt(id_mode),
            statut: 'active'
          }
        });
      }

      // Si aucune offre spécifique trouvée, chercher la première offre active de l'établissement
      if (!offre) {
        offre = await Offre.findOne({
          where: {
            id_etab_formation: etablissement.id_etab_formation,
            statut: 'active'
          }
        });
      }

      // Si toujours aucune offre trouvée, créer une offre par défaut
      if (!offre) {
        // Récupérer les premières valeurs disponibles pour créer une offre par défaut
        const specialite = await Specialite.findOne();
        const diplome = await Diplome.findOne();
        const modeFormation = await Mode_Formation.findOne();

        if (specialite && diplome && modeFormation) {
          offre = await Offre.create({
            id_specialite: specialite.id_specialite,
            id_etab_formation: etablissement.id_etab_formation,
            id_diplome: diplome.id_diplome,
            id_mode: modeFormation.id_mode,
            statut: 'active',
            date_debut: new Date(),
            date_fin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // +1 an
          });
        }
      }

      // Créer l'inscription du stagiaire à l'offre
      let inscription = null;
      if (offre) {
        inscription = await Inscription.create({
          id_stagiaire: stagiaire.id_stagiaire,
          id_offre: offre.id_offre,
          date_inscription: new Date(),
          statut: 'acceptee'
        });
      }

      return res.status(201).json({
        message: 'Établissement de formation créé avec succès avec stagiaire et inscription',
        etablissement: {
          id_etab_formation: etablissement.id_etab_formation,
          code: etablissement.code,
          nom_fr: etablissement.nom_fr,
          nom_ar: etablissement.nom_ar
        },
        stagiaire: {
          id_stagiaire: stagiaire.id_stagiaire,
          nom_fr: stagiaire.nom_fr,
          prenom_fr: stagiaire.prenom_fr
        },
        offre: offre ? {
          id_offre: offre.id_offre,
          designation: offre.designation_fr
        } : null,
        inscription: inscription ? {
          id_inscription: inscription.id_inscription,
          statut: inscription.statut
        } : null
      });

    } catch (error) {
      console.error('Erreur lors de la création de l\'établissement de formation:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la création de l\'établissement de formation', 
        error: error.message 
      });
    }
  }
};

module.exports = AuthController;


