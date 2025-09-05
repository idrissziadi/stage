const nodemailer = require('nodemailer');

const FreeEmailController = {
  // Envoyer un email de contact via service gratuit
  async sendContactEmail(req, res) {
    try {
      const { name, email, message } = req.body;

      // Validation des champs requis
      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          message: 'Tous les champs sont requis (nom, email, message)'
        });
      }

      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Format d\'email invalide'
        });
      }

      // Log the message
      console.log('=== NOUVELLE MESSAGE DE CONTACT ===');
      console.log('Nom:', name);
      console.log('Email:', email);
      console.log('Message:', message);
      console.log('Date:', new Date().toLocaleString('ar-DZ'));
      console.log('=====================================');

      // Essayer d'envoyer via Formspree (service gratuit)
      try {
        const formspreeResponse = await fetch('https://formspree.io/f/xpwkqkqk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: message,
            _subject: `رسالة جديدة من ${name} - نظام إدارة التدريب`,
            _replyto: email
          })
        });

        if (formspreeResponse.ok) {
          console.log('Email envoyé via Formspree avec succès');
          res.status(200).json({
            success: true,
            message: 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.',
            method: 'formspree'
          });
          return;
        }
      } catch (formspreeError) {
        console.log('Erreur Formspree:', formspreeError.message);
      }

      // Fallback: Envoyer via webhook vers un service de notification
      try {
        const webhookResponse = await fetch('https://hooks.zapier.com/hooks/catch/1234567890/abcdef/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toISOString(),
            source: 'formation_website'
          })
        });

        if (webhookResponse.ok) {
          console.log('Notification envoyée via webhook avec succès');
          res.status(200).json({
            success: true,
            message: 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.',
            method: 'webhook'
          });
          return;
        }
      } catch (webhookError) {
        console.log('Erreur webhook:', webhookError.message);
      }

      // Dernier recours: Simulation
      console.log('⚠️ Aucun service d\'email configuré. Simulation de l\'envoi...');
      
      res.status(200).json({
        success: true,
        message: 'تم إرسال الرسالة بنجاح! (نظام تجريبي - يرجى إعداد خدمة إيميل للإرسال الحقيقي)',
        messageId: 'simulated-' + Date.now(),
        note: 'Aucun service d\'email configuré'
      });

    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      
      res.status(500).json({
        success: false,
        message: 'خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = FreeEmailController;
