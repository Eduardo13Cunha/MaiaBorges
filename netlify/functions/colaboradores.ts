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
        const pathParts = event.path.split('/').filter(Boolean);
        const isPerfilRoute = pathParts.includes('perfil');
        const id = pathParts.at(-1);

        const selectQuery = `
          id_colaborador,
          nome,
          email,
          numero,
          data_nascimento,
          id_turno,
          turnos (descricao)
        `;

        if (isPerfilRoute && id) {
          const { data, error } = await supabase
            .from("colaboradores")
            .select(selectQuery)
            .eq("id_colaborador", id)
            .single();

          if (error) throw error;

          return {
            statusCode: 200,
            body: JSON.stringify({ status: "success", data })
          };
        }

        const { data, error } = await supabase
          .from("colaboradores")
          .select(selectQuery);

        if (error) throw error;

        return {
          statusCode: 200,
          body: JSON.stringify({ status: "success", data })
        };
      }

      case 'POST':
        const newData = JSON.parse(event.body!);
        const { data: newColab, error: postError } = await supabase
          .from("colaboradores")
          .insert([newData])
          .select(`
            id_colaborador,
            nome,
            email,
            numero,
            data_nascimento,
            id_turno,
            turnos (descricao)
          `)
          .single();
        
        if (postError) throw postError;
        return {
          statusCode: 201,
          body: JSON.stringify({ status: "success", data: newColab })
        };

      case 'DELETE':
        const id = event.path.split('/').pop();
        const { error: deleteError } = await supabase
          .from("colaboradores")
          .delete()
          .eq("id_colaborador", id);
        
        if (deleteError) throw deleteError;
        return { statusCode: 204 };

      case 'PUT':
        const colabId = event.path.split('/').pop();
        const body = JSON.parse(event.body!);
        const updates = {
          nome: body.nome,
          email: body.email,
          numero: body.numero,
          data_nascimento: body.data_nascimento,
          id_turno: body.id_turno
        };
        const { data: updatedColab, error: putError } = await supabase
          .from("colaboradores")
          .update(updates)
          .eq("id_colaborador", colabId)
          .select(`
            id_colaborador,
            nome,
            email,
            numero,
            data_nascimento,
            id_turno,
            turnos (descricao)
          `);

        if (putError) throw putError;
        return {
          statusCode: 200,
          body: JSON.stringify(updatedColab)
        };

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};