const express = require('express');
const router = express.Router();
const FreeEmailController = require('../controllers/FreeEmailController');

// Route pour envoyer un email de contact via service gratuit
router.post('/contact', FreeEmailController.sendContactEmail);

module.exports = router;
