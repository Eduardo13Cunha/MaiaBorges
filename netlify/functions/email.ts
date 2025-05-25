import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase environment variables!");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
      const { userName, userId, sugestao } = body;
      const mailOptions = {
        from: 'itparkmanager.pap@gmail.com',
        to: 'eduardocunha.302988@rauldoria.pt',
        subject: 'Contacto Recebido - Maia Borges',
        text: `O ${userName} com o Id - ${userId} enviou a seguinte mensagem:\n   ${sugestao}`
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

    if (event.path.endsWith('/recuperar-email')) {
      const { userEmail } = body;
      const NewPassword = Math.random().toString(36).slice(-12);
      const { data: updatedUser, error: updateError } = await supabase
        .from("colaboradores")
        .update({ password: NewPassword })
        .eq("email", userEmail)
        .select(`*`);

      if (updatedUser && updatedUser.length > 0) {
        const mailOptions = {
          from: 'itparkmanager.pap@gmail.com',
          to: userEmail,
          subject: 'Recuperação de Senha - Maia Borges',
          text: `Sua nova senha é: ${NewPassword}\nPor favor, altere-a após o primeiro login!`
        };

        await transporter.sendMail(mailOptions);

        return {
          statusCode: 200,
          body: JSON.stringify({ status: 'success', data: updatedUser[0] })
        };
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify({ status: 'error', message: 'Email inválido' })
        };
      }
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