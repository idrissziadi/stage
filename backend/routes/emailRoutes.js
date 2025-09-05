const express = require('express');
const router = express.Router();
const EmailController = require('../controllers/EmailController');

// Route pour envoyer un email de contact
router.post('/contact', EmailController.sendContactEmail);

// Route pour tester la configuration email
router.get('/test', EmailController.testEmailConfig);

module.exports = router;
