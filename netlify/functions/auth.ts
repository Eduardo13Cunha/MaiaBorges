import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase environment variables!");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body!);
    const { data, error } = await supabase
      .from("colaboradores")
      .select(`*`)
      .eq(`email`, email);

    if (error) throw error;

    if (data.length > 0) {
      const user = data[0];
      if (await bcrypt.compare(password, user.password) || password === user.password) {
        return {
          statusCode: 200,
          body: JSON.stringify({ status: 'success', data: data[0] })
        };
      } else {
        return {
          statusCode: 401,
          body: JSON.stringify({ status: 'error', message: 'Password inválida' })
        };
      }
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ status: 'error', message: 'Email inválido' })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao buscar Utilizador', details: error instanceof Error ? error.message : String(error) })
    };
  }
};