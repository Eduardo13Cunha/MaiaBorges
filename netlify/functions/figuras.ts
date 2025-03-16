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
          .from("figuras")
          .select(`
            *,
            materias_primas (nome),
            figura_corantes (quantidade_corante, corantes (id_corante,nome))
          `);

        if (error) throw error;

        return {
          statusCode: 200,
          body: JSON.stringify({ status: "success", data })
        };
      }

      case 'POST': {
        const body = JSON.parse(event.body || '{}');
        const {
          referencia,
          nome,
          tempo_ciclo,
          id_materiasprima,
          quantidade_materia_prima,
          corantes,
        } = body;

        // Insert the figure first
        const { data, error } = await supabase
          .from("figuras")
          .insert([
            {
              referencia,
              nome,
              tempo_ciclo,
              id_materiasprima,
              quantidade_materia_prima,
            },
          ])
          .select(`
            *,
            materias_primas (nome)
          `)
          .single();

        if (error) throw error;

        // Add the dyes to figura_corantes table
        const figuraId = data.id_figura;
        const figuraCorantes = corantes.map(({ id_corante, quantidade_corante }) => ({
          id_figura: figuraId,
          id_corante,
          quantidade_corante,
        }));

        const { error: corantesError } = await supabase
          .from("figura_corantes")
          .insert(figuraCorantes);

        if (corantesError) throw corantesError;

        return {
          statusCode: 201,
          body: JSON.stringify({ status: "success", data })
        };
      }

      case 'DELETE': {
        const id = event.path.split('/').pop();

        // Delete associated dyes first
        const { error: corantesError } = await supabase
          .from("figura_corantes")
          .delete()
          .eq("id_figura", id);

        if (corantesError) throw corantesError;

        // Delete the figure
        const { error } = await supabase
          .from("figuras")
          .delete()
          .eq("id_figura", id);

        if (error) throw error;

        return {
          statusCode: 204,
          body: ''
        };
      }

      case 'PUT': {
        const id = event.path.split('/').pop();
        const body = JSON.parse(event.body || '{}');
        const {
          referencia,
          nome,
          tempo_ciclo,
          id_materiasprima,
          quantidade_materia_prima,
          corantes,
        } = body;

        // Update figure data
        const { data, error } = await supabase
          .from("figuras")
          .update({
            referencia,
            nome,
            tempo_ciclo,
            id_materiasprima,
            quantidade_materia_prima,
          })
          .eq("id_figura", id)
          .select(`
            *,
            materias_primas (nome)
          `)
          .single();

        if (error) throw error;

        // Delete old dyes
        const { error: deleteCorantesError } = await supabase
          .from("figura_corantes")
          .delete()
          .eq("id_figura", id);

        if (deleteCorantesError) throw deleteCorantesError;

        // Insert new dyes
        const figuraCorantes = corantes.map(({ id_corante, quantidade_corante }) => ({
          id_figura: id,
          id_corante,
          quantidade_corante,
        }));

        const { error: corantesError } = await supabase
          .from("figura_corantes")
          .insert(figuraCorantes);

        if (corantesError) throw corantesError;

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