import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase environment variables!");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const handler: Handler = async (event) => {
  try {
    switch (event.httpMethod) {
      case 'GET': {
        const { data, error } = await supabase
          .from("materias_primas")
          .select("*");

        if (error) throw error;

        return {
          statusCode: 200,
          body: JSON.stringify({ status: "success", data })
        };
      }

      case 'POST': {
        const body = JSON.parse(event.body || '{}');
        const { nome, quantidade } = body;

        const { data, error } = await supabase
          .from("materias_primas")
          .insert([{ nome, quantidade }])
          .select()
          .single();

        if (error) throw error;

        return {
          statusCode: 201,
          body: JSON.stringify({ status: "success", data })
        };
      }

      case 'DELETE': {
        const id = event.path.split('/').pop();
        
        const { error } = await supabase
          .from("materias_primas")
          .delete()
          .eq("id_materiasprima", id);

        if (error) throw error;

        return {
          statusCode: 204,
          body: ''
        };
      }

      case 'PUT': {
        const id = event.path.split('/').pop();
        const body = JSON.parse(event.body || '{}');
        const { nome, quantidade } = body;

        const { data, error } = await supabase
          .from("materias_primas")
          .update({ nome, quantidade })
          .eq("id_materiasprima", id)
          .select()
          .single();

        if (error) throw error;

        return {
          statusCode: 200,
          body: JSON.stringify(data)
        };
      }

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};