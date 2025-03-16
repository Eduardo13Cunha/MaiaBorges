import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

let enviou = false;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body!);
    
    if (event.path.endsWith('/send-email')) {
      const { sugestao } = body;
      const mailOptions = {
        from: 'itparkmanager.pap@gmail.com',
        to: 'eduardocunha302988@rauldoria.pt',
        subject: 'Nova Opinião Recebida',
        text: sugestao
      };

      await transporter.sendMail(mailOptions);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'E-mail enviado com sucesso' })
      };
    }
    
    if (event.path.endsWith('/alert-email')) {
      if (enviou) {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'O e-mail já foi enviado.' })
        };
      }

      const { lowItemsCorantes, lowItemsMateriasPrimas } = body;

      let mailCorantes = '';
      if (lowItemsCorantes?.length > 0) {
        mailCorantes = `
          <p>Corantes:</p>
          <ul>
            ${lowItemsCorantes.map((item: any) => `<li>${item.nome} - ${item.quantidade} G</li>`).join('')}
          </ul>`;
      }

      let mailMateriaprima = '';
      if (lowItemsMateriasPrimas?.length > 0) {
        mailMateriaprima = `
          <p>Matéria Prima:</p>
          <ul>
            ${lowItemsMateriasPrimas.map((item: any) => `<li>${item.nome} - ${item.quantidade} Kg</li>`).join('')}
          </ul>`;
      }

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

      await transporter.sendMail(mailOptions);
      enviou = true;
      
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'E-mail de alerta enviado com sucesso' })
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Endpoint not found' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};