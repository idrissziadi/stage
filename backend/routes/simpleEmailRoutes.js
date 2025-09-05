const express = require('express');
const router = express.Router();
const SimpleEmailController = require('../controllers/SimpleEmailController');

// Route pour envoyer un email de contact simple
router.post('/contact', SimpleEmailController.sendContactEmail);

module.exports = router;
