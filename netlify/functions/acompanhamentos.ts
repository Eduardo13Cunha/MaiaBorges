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
      case 'GET':
        const { data, error } = await supabase
        .from("acompanhamento").select(`
          *,
          maquinas (nome),
          encomendas (id_encomenda, quantidade, figuras (id_figura, nome)),
          colaboradores (nome)
        `);
        
        if (error) throw error;
        return {
          statusCode: 200,
          body: JSON.stringify({ status: "success", data })
        };

      case 'POST':
        try {
          const { id_planodetrabalho, id_maquina, id_encomenda, id_colaborador, quantidade_produzida, dia_hora } = JSON.parse(event.body!);
          const { data: newAcomp, error: postError } = await supabase
            .from("acompanhamento")
            .insert([{ 
              id_planodetrabalho,
              id_maquina, 
              id_encomenda, 
              id_colaborador, 
              quantidade_produzida,
              dia_hora 
            }]);
            
          if (postError) {
            return {
              statusCode: 400,
              body: JSON.stringify({ error: 'Error creating acompanhamento' })
            };
          }

          const { data: planoTrabalho, error: planoError } = await supabase
          .from("plano_trabalho")
          .select("quantidade, quantidade_falta")
          .eq("id_planodetrabalho", id_planodetrabalho)
          .single();
  
          if (!planoError && planoTrabalho) {
            const novaQuantidadeFalta = Math.max(0, planoTrabalho.quantidade_falta - quantidade_produzida);
            
            await supabase
              .from("plano_trabalho")
              .update({ quantidade_falta: novaQuantidadeFalta })
              .eq("id_planodetrabalho", id_planodetrabalho);
          }

          return {
            statusCode: 201,
            body: JSON.stringify({ status: "success", data: newAcomp })
          };
        }
        catch (error) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid request data' })
          };
        }

      case 'DELETE':
        const id = event.path.split('/').pop();
        
        // Get acompanhamento info before deletion
        const { data: acompanhamento, error: getError } = await supabase
          .from("acompanhamento")
          .select("planotrabalho_id, quantidade_produzida")
          .eq("id", id)
          .single();

        if (getError) throw getError;

        // Delete acompanhamento
        const { error: deleteError } = await supabase
          .from("acompanhamento")
          .delete()
          .eq("id", id);

        if (deleteError) throw deleteError;

        // Update plano_trabalho
        if (acompanhamento) {
          const { data: plano, error: planoGetError } = await supabase
            .from("plano_trabalho")
            .select("quantidade_falta")
            .eq("id", acompanhamento.planotrabalho_id)
            .single();

          if (!planoGetError && plano) {
            const novaQuantidadeFalta = plano.quantidade_falta + acompanhamento.quantidade_produzida;
            
            await supabase
              .from("plano_trabalho")
              .update({ quantidade_falta: novaQuantidadeFalta })
              .eq("id", acompanhamento.planotrabalho_id);
          }
        }

        return { 
          statusCode: 200,
          body: JSON.stringify({ 
            status: "success", 
            message: "Acompanhamento excluído com sucesso" 
          })
        };

      case 'PUT':
        const updateId = event.path.split('/').pop();
        const updates = JSON.parse(event.body!);

        // Get current acompanhamento
        const { data: currentAcomp, error: getCurrentError } = await supabase
          .from("acompanhamento")
          .select("quantidade_produzida, planotrabalho_id")
          .eq("id", updateId)
          .single();

        if (getCurrentError) throw getCurrentError;

        // Update acompanhamento
        const { data: updatedAcomp, error: updateError } = await supabase
          .from("acompanhamento")
          .update(updates)
          .eq("id", updateId)
          .select(`
            *,
            maquinas (nome),
            encomendas (id_encomenda, quantidade, figuras (nome)),
            colaboradores (nome)
          `);

        if (updateError) throw updateError;

        // Update plano_trabalho if quantidade_produzida changed
        if (currentAcomp && currentAcomp.quantidade_produzida !== updates.quantidade_produzida) {
          const diferenca = updates.quantidade_produzida - currentAcomp.quantidade_produzida;
          
          const { data: plano, error: planoGetError } = await supabase
            .from("plano_trabalho")
            .select("quantidade_falta")
            .eq("id", currentAcomp.planotrabalho_id)
            .single();

          if (!planoGetError && plano) {
            const novaQuantidadeFalta = Math.max(0, plano.quantidade_falta - diferenca);
            
            await supabase
              .from("plano_trabalho")
              .update({ quantidade_falta: novaQuantidadeFalta })
              .eq("id", currentAcomp.planotrabalho_id);
          }
        }

        return {
          statusCode: 200,
          body: JSON.stringify(updatedAcomp)
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