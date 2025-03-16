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

// Helper functions
async function verificarEstoque(idFigura: string, quantidade: number) {
  const { data: figuraData, error: figuraError } = await supabase
    .from("figuras")
    .select(`
      id_materiasprima,
      quantidade_materia_prima,
      figura_corantes (id_corante, quantidade_corante)
    `)
    .eq("id_figura", idFigura)
    .single();
  
  if (figuraError) throw new Error("Erro ao buscar informações da figura");

  let insuficienteDetalhes: { tipo: string; id: string; necessario: number; disponivel: number }[] = [];

  const totalMateriaPrima = figuraData.quantidade_materia_prima * quantidade;
  const { data: materiaPrimaData } = await supabase
    .from("materias_primas")
    .select("nome,quantidade")
    .eq("id_materiasprima", figuraData.id_materiasprima)
    .single();
  
  if (materiaPrimaData && materiaPrimaData.quantidade < totalMateriaPrima) {
    insuficienteDetalhes.push({
      tipo: "Materia Prima",
      id: materiaPrimaData.nome,
      necessario: totalMateriaPrima,
      disponivel: materiaPrimaData.quantidade
    });
  }
  
  // Check corantes
  for (const corante of figuraData.figura_corantes) {
    const totalCorante = corante.quantidade_corante * quantidade;
    const { data: coranteData } = await supabase
      .from("corantes")
      .select("nome,quantidade")
      .eq("id_corante", corante.id_corante)
      .single();
    
    if (coranteData && coranteData.quantidade < totalCorante) {
      insuficienteDetalhes.push({
        tipo: "Corante",
        id: coranteData.nome,
        necessario: totalCorante,
        disponivel: coranteData.quantidade
      });
    }
  }

  return {
    suficiente: insuficienteDetalhes.length === 0,
    detalhes: insuficienteDetalhes
  };
}

async function subtrairEstoque(idFigura: string, quantidade: number) {
  const { data: figuraData } = await supabase
    .from("figuras")
    .select(`
      id_materiasprima,
      quantidade_materia_prima,
      figura_corantes (id_corante, quantidade_corante)
    `)
    .eq("id_figura", idFigura)
    .single();

  if (!figuraData) {
    throw new Error("Figura data is null");
  }
  
  // Subtract matéria prima
  const totalMateriaPrima = figuraData.quantidade_materia_prima * quantidade;
  const { data: materiaPrimaData } = await supabase
    .from("materias_primas")
    .select("quantidade")
    .eq("id_materiasprima", figuraData.id_materiasprima)
    .single();
  
  if (!materiaPrimaData) {
    throw new Error("Materia Prima data is null");
  }

  await supabase
    .from("materias_primas")
    .update({ quantidade: materiaPrimaData.quantidade - totalMateriaPrima })
    .eq("id_materiasprima", figuraData.id_materiasprima);
  
  // Subtract corantes
  for (const corante of figuraData.figura_corantes) {
    const totalCorante = corante.quantidade_corante * quantidade;
    const { data: coranteData } = await supabase
      .from("corantes")
      .select("quantidade")
      .eq("id_corante", corante.id_corante)
      .single();

    if (!coranteData) {
      throw new Error("Corante data is null");
    }
    
    await supabase
      .from("corantes")
      .update({ quantidade: coranteData.quantidade - totalCorante })
      .eq("id_corante", corante.id_corante);
  }
}

async function devolverEstoque(idFigura: string, quantidade: number) {
  const { data: figuraData } = await supabase
    .from("figuras")
    .select(`
      id_materiasprima,
      quantidade_materia_prima,
      figura_corantes (id_corante, quantidade_corante)
    `)
    .eq("id_figura", idFigura)
    .single();
    
  if (!figuraData) {
    throw new Error("Figura data is null");
  }

  // Return matéria prima
  const totalMateriaPrima = figuraData.quantidade_materia_prima * quantidade;
  const { data: materiaPrimaData } = await supabase
    .from("materias_primas")
    .select("quantidade")
    .eq("id_materiasprima", figuraData.id_materiasprima)
    .single();

  if (!materiaPrimaData) {
    throw new Error("Materia Prima data is null");
  }

  await supabase
    .from("materias_primas")
    .update({ quantidade: materiaPrimaData.quantidade + totalMateriaPrima })
    .eq("id_materiasprima", figuraData.id_materiasprima);
  
  // Return corantes
  for (const corante of figuraData.figura_corantes) {
    const totalCorante = corante.quantidade_corante * quantidade;
    const { data: coranteData } = await supabase
      .from("corantes")
      .select("quantidade")
      .eq("id_corante", corante.id_corante)
      .single();
    
    if (!coranteData) {
      throw new Error("Corante data is null");
    }

    await supabase
      .from("corantes")
      .update({ quantidade: coranteData.quantidade + totalCorante })
      .eq("id_corante", corante.id_corante);
  }
}

export const handler: Handler = async (event) => {
  try {
    switch (event.httpMethod) {
      case 'GET':
        const { data, error } = await supabase.from("encomendas").select(`
          *,
          figuras (*),
          clientes (*)
        `);
        if (error) throw error;
        return {
          statusCode: 200,
          body: JSON.stringify({ status: "success", data })
        };

      case 'POST':
        const { id_figura, id_cliente, quantidade, semana } = JSON.parse(event.body!);
        
        // Check stock
        const estoqueDisponivel = await verificarEstoque(id_figura, quantidade);
        if (!estoqueDisponivel.suficiente) {
          return {
            statusCode: 400,
            body: JSON.stringify({ 
              error: "Estoque insuficiente",
              details: estoqueDisponivel.detalhes
            })
          };
        }

        // Create order
        const { data: newEncomenda, error: postError } = await supabase
          .from("encomendas")
          .insert([{ id_figura, id_cliente, quantidade, semana }])
          .select(`
            *,
            figuras (nome),
            clientes (nome)
          `)
          .single();
        
        if (postError) throw postError;

        // Update stock
        await subtrairEstoque(id_figura, quantidade);

        return {
          statusCode: 201,
          body: JSON.stringify({ 
            status: "success", 
            data: newEncomenda,
            message: "Encomenda criada e estoques atualizados com sucesso"
          })
        };

      case 'DELETE':
        const id = event.path.split('/').pop();
        
        // Get order info before deletion
        const { data: encomenda, error: getError } = await supabase
          .from("encomendas")
          .select("id_figura, quantidade")
          .eq("id_encomenda", id)
          .single();
        
        if (getError) throw getError;

        // Return stock
        if (encomenda) {
          await devolverEstoque(encomenda.id_figura, encomenda.quantidade);
        }

        // Delete order
        const { error: deleteError } = await supabase
          .from("encomendas")
          .delete()
          .eq("id_encomenda", id);
        
        if (deleteError) throw deleteError;

        return {
          statusCode: 200,
          body: JSON.stringify({ 
            status: "success", 
            message: "Encomenda excluída e materiais devolvidos ao estoque" 
          })
        };

      case 'PUT':
        const encomendaId = event.path.split('/').pop();
        const updates = JSON.parse(event.body!);

        // Get current order
        const { data: currentEncomenda, error: getCurrentError } = await supabase
          .from("encomendas")
          .select("quantidade, id_figura")
          .eq("id_encomenda", encomendaId)
          .single();
        
        if (getCurrentError) throw getCurrentError;

        // Handle stock changes
        if (currentEncomenda) {
          if (currentEncomenda.id_figura !== updates.id_figura) {
            // Return old stock
            await devolverEstoque(currentEncomenda.id_figura, currentEncomenda.quantidade);
            
            // Check and subtract new stock
            const estoqueDisponivel = await verificarEstoque(updates.id_figura, updates.quantidade);
            if (!estoqueDisponivel.suficiente) {
              return {
                statusCode: 400,
                body: JSON.stringify({ 
                  error: "Estoque insuficiente para a nova configuração",
                  details: estoqueDisponivel.detalhes
                })
              };
            }
            
            await subtrairEstoque(updates.id_figura, updates.quantidade);
          } 
          else if (currentEncomenda.quantidade !== updates.quantidade) {
            const diferenca = updates.quantidade - currentEncomenda.quantidade;
            
            if (diferenca > 0) {
              const estoqueDisponivel = await verificarEstoque(updates.id_figura, diferenca);
              if (!estoqueDisponivel.suficiente) {
                return {
                  statusCode: 400,
                  body: JSON.stringify({ 
                    error: "Estoque insuficiente para aumentar a quantidade",
                    details: estoqueDisponivel.detalhes
                  })
                };
              }
              
              await subtrairEstoque(updates.id_figura, diferenca);
            } else {
              await devolverEstoque(updates.id_figura, Math.abs(diferenca));
            }
          }
        }

        // Update order
        const { data: updatedEncomenda, error: putError } = await supabase
          .from("encomendas")
          .update(updates)
          .eq("id_encomenda", encomendaId)
          .select(`
            *,
            figuras (nome),
            clientes (nome)
          `)
          .single();
        
        if (putError) throw putError;

        return {
          statusCode: 200,
          body: JSON.stringify(updatedEncomenda)
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