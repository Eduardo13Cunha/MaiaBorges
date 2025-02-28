import express from 'express';
import cors from 'cors';
import transporter from '../config/mailer.js';

const app = express();

// Middleware para processar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Habilitar CORS (se estiver chamando de outro domínio ou porta diferente)
app.use(cors());

// Suas rotas...

const router = express.Router();
let enviou = false;

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

// Enviar Alerta de Limite de Material
router.post('/alert-email', (req, res) => {
  if (enviou) {
    return res.status(200).send('O e-mail já foi enviado.');
  }
  console.log("tou aqui");
  const { lowItemsCorantes, lowItemsMateriasPrimas } = req.body;

  // Verifica se existe e não está vazio
  let mailCorantes = '';
  if (lowItemsCorantes && lowItemsCorantes.length > 0) {
    mailCorantes = `
      <p>Corantes:</p>
      <ul>
        ${lowItemsCorantes.map(item => `<li>${item.nome} - ${item.quantidade} G</li>`).join('')}
      </ul>`;
  }

  let mailMateriaprima = '';
  if (lowItemsMateriasPrimas && lowItemsMateriasPrimas.length > 0) {
    mailMateriaprima = `
      <p>Matéria Prima:</p>
      <ul>
        ${lowItemsMateriasPrimas.map(item => `<li>${item.nome} - ${item.quantidade} Kg</li>`).join('')}
      </ul>`;
  }

  // Prepare as opções do e-mail
  const mailOptions = {
    from: 'itparkmanager.pap@gmail.com',
    to: 'eduardocunha.302988@rauldoria.pt',
    subject: 'ALERTA: Níveis baixos de inventário',
    html: `
      <h2>Alerta de Inventário</h2>
      <p>Os seguintes itens estão com níveis baixos:</p>
      ${mailCorantes}
      ${mailMateriaprima}
      <p>Por favor, reabasteça esses itens o mais rápido possível.</p>
    `
  };

  // Enviar o e-mail
  if (!enviou) {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(200).send('E-mail enviado: ' + info.response);
      enviou = true;
    });
  }
});

export default router;