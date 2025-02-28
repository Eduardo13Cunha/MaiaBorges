import express from 'express';
import transporter from '../config/mailer.js';

const router = express.Router();

// Endpoint para enviar e-mail
router.post('/send-email', (req, res) => {
  const { sugestao } = req.body;
  const mailOptions = {
    from: 'itparkmanager.pap@gmail.com',
    to: 'eduardocunha302988@rauldoria.pt',
    subject: 'Nova Opinião Recebida',
    text: sugestao
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('E-mail enviado: ' + info.response);
  });
});

export default router;