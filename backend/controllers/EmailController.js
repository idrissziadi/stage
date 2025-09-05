const nodemailer = require('nodemailer');

// Configuration du transporteur email avec Ethereal (service de test gratuit)
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'ethereal.user@ethereal.email',
    pass: 'ethereal.pass'
  }
});

// Configuration Gmail (pour plus tard)
const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'idriss.ziadi47@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

const EmailController = {
  // Envoyer un email de contact
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

      // Configuration de l'email
      const mailOptions = {
        from: 'noreply@formation.gov.dz',
        to: 'idriss.ziadi47@gmail.com',
        subject: `رسالة جديدة من ${name} - نظام إدارة التدريب`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb; text-align: center;">رسالة جديدة من موقع نظام إدارة التدريب</h2>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-bottom: 15px;">معلومات المرسل:</h3>
              <p><strong>الاسم:</strong> ${name}</p>
              <p><strong>البريد الإلكتروني:</strong> ${email}</p>
            </div>
            
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h3 style="color: #1e40af; margin-bottom: 15px;">الرسالة:</h3>
              <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 15px; background-color: #f1f5f9; border-radius: 8px;">
              <p style="color: #64748b; font-size: 14px;">
                تم إرسال هذه الرسالة من نظام إدارة التدريب والتكوين المهني
              </p>
              <p style="color: #64748b; font-size: 12px;">
                التاريخ: ${new Date().toLocaleString('ar-DZ')}
              </p>
            </div>
          </div>
        `,
        text: `
رسالة جديدة من نظام إدارة التدريب

المرسل: ${name}
البريد الإلكتروني: ${email}

الرسالة:
${message}

التاريخ: ${new Date().toLocaleString('ar-DZ')}
        `
      };

      // Envoyer via EmailJS (service gratuit et fiable)
      try {
        const emailjsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: 'service_formation',
            template_id: 'template_contact',
            user_id: 'user_id_formation',
            template_params: {
              from_name: name,
              from_email: email,
              message: message,
              to_email: 'idriss.ziadi47@gmail.com'
            }
          })
        });

        if (emailjsResponse.ok) {
          console.log('Email envoyé via EmailJS avec succès');
          res.status(200).json({
            success: true,
            message: 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.',
            method: 'emailjs'
          });
          return;
        }
      } catch (emailjsError) {
        console.log('Erreur EmailJS, tentative avec webhook:', emailjsError.message);
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
        console.log('Erreur webhook, tentative avec Ethereal:', webhookError.message);
      }

      // Fallback: Envoyer l'email avec Ethereal
      const info = await transporter.sendMail(mailOptions);
      console.log('Email envoyé avec succès via Ethereal:', info.messageId);
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

      res.status(200).json({
        success: true,
        message: 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.',
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info),
        method: 'ethereal'
      });

    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      
      res.status(500).json({
        success: false,
        message: 'خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Tester la configuration email
  async testEmailConfig(req, res) {
    try {
      await transporter.verify();
      res.status(200).json({
        success: true,
        message: 'Configuration email valide'
      });
    } catch (error) {
      console.error('Erreur de configuration email:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur de configuration email',
        error: error.message
      });
    }
  }
};

module.exports = EmailController;
