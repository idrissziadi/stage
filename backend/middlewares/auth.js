const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_me';

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

async function isTokenBlacklisted(token) {
  const found = await TokenBlacklist.findOne({ where: { tokenHash: sha256Hex(token) } });
  return Boolean(found);
}

async function isAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization Bearer requis' });
    }
    const token = authHeader.slice(7);
    if (await isTokenBlacklisted(token)) {
      return res.status(401).json({ message: 'Token expiré ou révoqué' });
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Token invalide' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}

function makeRoleGuard(expectedRole) {
  return function roleGuard(req, res, next) {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
    if (req.user.role !== expectedRole) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    return next();
  };
}

const isStagiaire = makeRoleGuard('Stagiaire');
const isEnseignant = makeRoleGuard('Enseignant');
const isEtablissementFormation = makeRoleGuard('EtablissementFormation');
const isRegional = makeRoleGuard('EtablissementRegionale');
const isNational = makeRoleGuard('EtablissementNationale');

module.exports = {
  isAuth,
  isStagiaire,
  isEnseignant,
  isEtablissementFormation,
  isRegional,
  isNational
};


