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
        if (event.path.endsWith('/dataplanotrabalho')) {
          const { data, error } = await supabase
            .from("plano_trabalho")
            .select(`
              *,
              maquinas (nome),
              encomendas (id_encomenda, quantidade, figuras (id_figura, nome)),
              colaboradores (nome)
            `)
            .gt('quantidade_falta', 0);

          if (error) throw error;

          return {
            statusCode: 200,
            body: JSON.stringify({ status: "success", data })
          };
        } else if (event.path.endsWith('/historicoplanotrabalho')) {
          const { data, error } = await supabase
            .from("plano_trabalho")
            .select(`
              *,
              maquinas (nome),
              encomendas (id_encomenda, quantidade, figuras (id_figura, nome)),
              colaboradores (nome)
            `)
            .eq('quantidade_falta', 0);

          if (error) throw error;

          return {
            statusCode: 200,
            body: JSON.stringify({ status: "success", data })
          };
        }
      }

      case 'POST': {
        const body = JSON.parse(event.body || '{}');
        const { 
          id_maquina, 
          id_encomenda, 
          id_colaborador, 
          semana,
          quantidade,
          tempo_conclusao,
          quantidade_falta 
        } = body;

        const { data, error } = await supabase
          .from("plano_trabalho")
          .insert([{ 
            id_maquina, 
            id_encomenda, 
            id_colaborador, 
            tempo_conclusao, 
            quantidade, 
            semana, 
            quantidade_falta 
          }])
          .select(`
            *,
            maquinas (nome),
            encomendas (id_encomenda, quantidade, figuras (id_figura, nome)),
            colaboradores (nome)
          `)
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
          .from("plano_trabalho")
          .delete()
          .eq("id_planodetrabalho", id);

        if (error) throw error;

        return {
          statusCode: 200,
          body: JSON.stringify({ 
            status: "success", 
            message: "Plano de trabalho excluído com sucesso" 
          })
        };
      }

      case 'PUT': {
        const id = event.path.split('/').pop();
        const body = JSON.parse(event.body || '{}');
        const { 
          maquina_id, 
          encomenda_id, 
          id_colaborador, 
          tempo_conclusao, 
          quantidade, 
          semana, 
          quantidade_falta 
        } = body;

        const { data, error } = await supabase
          .from("plano_trabalho")
          .update({ 
            maquina_id, 
            encomenda_id, 
            id_colaborador, 
            tempo_conclusao, 
            quantidade, 
            semana, 
            quantidade_falta 
          })
          .eq("id", id)
          .select(`
            *,
            maquinas (nome),
            encomendas (id_encomenda, quantidade, figuras (nome)),
            colaboradores (nome)
          `)
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