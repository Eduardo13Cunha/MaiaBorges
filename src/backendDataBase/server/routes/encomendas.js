import express from 'express';
import supabase from '../config/db.js';

const router = express.Router();

// Endpoint para buscar todas as encomendas com suas relações
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("encomendas").select(`
    *,
    figuras (*),
    clientes (*)
  `);

  if (error) {
    console.error("Erro ao buscar encomendas:", error);
    return res.status(500).json({ error: "Erro ao buscar encomendas" });
  }
  
  res.json({ status: "success", data });
});

// Endpoint para adicionar uma nova encomenda
router.post("/", async (req, res) => {
  const { id_figura, id_cliente, quantidade, semana} = req.body;
  
  // Iniciar uma transação para garantir a consistência dos dados
  try {
    // 1. Buscar informações da figura (matéria prima e quantidade)
    const { data: figuraData, error: figuraError } = await supabase
      .from("figuras")
      .select(`
        id_figura,
        nome,
        id_materiasprima,
        quantidade_materia_prima,
        figura_corantes (id_corante, quantidade_corante)
      `)
      .eq("id_figura", id_figura)
      .single();
    
    if (figuraError) {
      console.error("Erro ao buscar informações da figura:", figuraError);
      return res.status(500).json({ error: "Erro ao buscar informações da figura" });
    }
    
    // 2. Calcular quantidade total de matéria prima necessária
    const totalMateriaPrima = figuraData.quantidade_materia_prima * quantidade;
    
    // 3. Verificar se há matéria prima suficiente
    const { data: materiaPrimaData, error: materiaPrimaError } = await supabase
      .from("materias_primas")
      .select("quantidade")
      .eq("id_materiasprima", figuraData.id_materiasprima)
      .single();
    
    if (materiaPrimaError) {
      console.error("Erro ao verificar estoque de matéria prima:", materiaPrimaError);
      return res.status(500).json({ error: "Erro ao verificar estoque de matéria prima" });
    }
    
    if (materiaPrimaData.quantidade < totalMateriaPrima) {
      return res.status(400).json({ 
        error: "Estoque insuficiente de matéria prima",
        required: totalMateriaPrima,
        available: materiaPrimaData.quantidade
      });
    }
    
    // 4. Verificar se há corantes suficientes
    for (const corante of figuraData.figura_corantes) {
      const totalCorante = corante.quantidade_corante * quantidade;
      
      const { data: coranteData, error: coranteError } = await supabase
        .from("corantes")
        .select("quantidade")
        .eq("id_corante", corante.id_corante)
        .single();
      
      if (coranteError) {
        console.error("Erro ao verificar estoque de corante:", coranteError);
        return res.status(500).json({ error: "Erro ao verificar estoque de corante" });
      }
      
      if (coranteData.quantidade < totalCorante) {
        return res.status(400).json({ 
          error: "Estoque insuficiente de corante",
          corante_id: corante.id_corante,
          required: totalCorante,
          available: coranteData.quantidade
        });
      }
    }
    
    // 5. Criar a encomenda
    const { data: encomendaData, error: encomendaError } = await supabase
      .from("encomendas")
      .insert([{ id_figura, id_cliente, quantidade, semana }])
      .select(`
        *,
        figuras (nome),
        clientes (nome)
      `)
      .single();
    
    if (encomendaError) {
      console.error("Erro ao adicionar encomenda:", encomendaError);
      return res.status(500).json({ error: "Erro ao adicionar encomenda" });
    }
    
    // 6. Atualizar o estoque de matéria prima
    const { error: updateMateriaPrimaError } = await supabase
      .from("materias_primas")
      .update({ 
        quantidade: materiaPrimaData.quantidade - totalMateriaPrima 
      })
      .eq("id_materiasprima", figuraData.id_materiasprima);
    
    if (updateMateriaPrimaError) {
      console.error("Erro ao atualizar estoque de matéria prima:", updateMateriaPrimaError);
      return res.status(500).json({ error: "Erro ao atualizar estoque de matéria prima" });
    }
    
    // 7. Atualizar o estoque de corantes
    for (const corante of figuraData.figura_corantes) {
      const totalCorante = corante.quantidade_corante * quantidade;
      
      const { data: coranteData } = await supabase
        .from("corantes")
        .select("quantidade")
        .eq("id_corante", corante.id_corante)
        .single();
      
      const { error: updateCoranteError } = await supabase
        .from("corantes")
        .update({ 
          quantidade: coranteData.quantidade - totalCorante 
        })
        .eq("id_corante", corante.id_corante);
      
      if (updateCoranteError) {
        console.error("Erro ao atualizar estoque de corante:", updateCoranteError);
        return res.status(500).json({ error: "Erro ao atualizar estoque de corante" });
      }
    }
    
    res.status(201).json({ 
      status: "success", 
      data: encomendaData,
      message: "Encomenda criada e estoques atualizados com sucesso"
    });
    
  } catch (error) {
    console.error("Erro durante o processamento da encomenda:", error);
    return res.status(500).json({ error: "Erro durante o processamento da encomenda" });
  }
});

// Endpoint para eliminar uma encomenda
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    // 1. Obter informações da encomenda antes de excluí-la
    const { data: encomenda, error: encomendaError } = await supabase
      .from("encomendas")
      .select("id_figura, quantidade")
      .eq("id_encomenda", id)
      .single();
    
    if (encomendaError) {
      console.error("Erro ao buscar informações da encomenda:", encomendaError);
      return res.status(500).json({ error: "Erro ao buscar informações da encomenda" });
    }
    
    // 2. Devolver os materiais ao estoque
    await devolverEstoque(encomenda.id_figura, encomenda.quantidade);
    
    // 3. Excluir a encomenda
    const { error } = await supabase
      .from("encomendas")
      .delete()
      .eq("id_encomenda", id);
    
    if (error) {
      console.error("Erro ao excluir encomenda:", error);
      return res.status(500).send("Erro interno do servidor");
    }
    
    res.status(200).json({ 
      status: "success", 
      message: "Encomenda excluída e materiais devolvidos ao estoque" 
    });
  } catch (error) {
    console.error("Erro ao processar exclusão da encomenda:", error);
    return res.status(500).json({ error: "Erro ao processar exclusão da encomenda" });
  }
});

// Endpoint para atualizar uma encomenda
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { id_figura, id_cliente, quantidade, semana } = req.body;

  // Obter a encomenda atual para calcular a diferença de quantidade
  const { data: encomendaAtual, error: encomendaError } = await supabase
    .from("encomendas")
    .select("quantidade, id_figura")
    .eq("id_encomenda", id)
    .single();

  if (encomendaError) {
    console.error("Erro ao buscar encomenda atual:", encomendaError);
    return res.status(500).send("Erro interno do servidor");
  }

  // Se a figura ou quantidade mudou, precisamos ajustar o estoque
  if (encomendaAtual.id_figura !== id_figura || encomendaAtual.quantidade !== quantidade) {
    try {
      // Se a figura mudou, precisamos devolver o estoque da figura antiga e subtrair da nova
      if (encomendaAtual.id_figura !== id_figura) {
        // Devolver estoque da figura antiga
        await devolverEstoque(encomendaAtual.id_figura, encomendaAtual.quantidade);
        
        // Verificar e subtrair estoque da nova figura
        const estoqueDisponivel = await verificarEstoque(id_figura, quantidade);
        if (!estoqueDisponivel.suficiente) {
          return res.status(400).json({ 
            error: "Estoque insuficiente para a nova configuração",
            details: estoqueDisponivel.detalhes
          });
        }
        
        await subtrairEstoque(id_figura, quantidade);
      } 
      // Se apenas a quantidade mudou, precisamos ajustar a diferença
      else if (encomendaAtual.quantidade !== quantidade) {
        const diferenca = quantidade - encomendaAtual.quantidade;
        
        if (diferenca > 0) {
          // Verificar se há estoque suficiente para o aumento
          const estoqueDisponivel = await verificarEstoque(id_figura, diferenca);
          if (!estoqueDisponivel.suficiente) {
            return res.status(400).json({ 
              error: "Estoque insuficiente para aumentar a quantidade",
              details: estoqueDisponivel.detalhes
            });
          }
          
          // Subtrair a diferença adicional
          await subtrairEstoque(id_figura, diferenca);
        } else if (diferenca < 0) {
          // Devolver a diferença ao estoque
          await devolverEstoque(id_figura, Math.abs(diferenca));
        }
      }
    } catch (error) {
      console.error("Erro ao ajustar estoque:", error);
      return res.status(500).json({ error: "Erro ao ajustar estoque" });
    }
  }

  // Atualizar a encomenda
  const { data, error } = await supabase
    .from("encomendas")
    .update({ id_figura, id_cliente, quantidade, semana })
    .eq("id_encomenda", id)
    .select(`
      *,
      figuras (nome),
      clientes (nome)
    `)
    .single();

  if (error) {
    console.error("Erro ao atualizar encomenda:", error);
    return res.status(500).send("Erro interno do servidor");
  }
  
  res.status(200).json(data);
});

// Função auxiliar para verificar se há estoque suficiente
async function verificarEstoque(idFigura, quantidade) {
  // Buscar informações da figura
  const { data: figuraData, error: figuraError } = await supabase
    .from("figuras")
    .select(`
      id_materiasprima,
      quantidade_materia_prima,
      figura_corantes (id_corante, quantidade_corante)
    `)
    .eq("id_figura", idFigura)
    .single();
  
  if (figuraError) {
    throw new Error("Erro ao buscar informações da figura");
  }
  
  // Verificar matéria prima
  const totalMateriaPrima = figuraData.quantidade_materia_prima * quantidade;
  const { data: materiaPrimaData } = await supabase
    .from("materias_primas")
    .select("quantidade")
    .eq("id_materiasprima", figuraData.id_materiasprima)
    .single();
  
  if (materiaPrimaData.quantidade < totalMateriaPrima) {
    return { 
      suficiente: false, 
      detalhes: {
        tipo: "materia_prima",
        id: figuraData.id_materiasprima,
        necessario: totalMateriaPrima,
        disponivel: materiaPrimaData.quantidade
      }
    };
  }
  
  // Verificar corantes
  for (const corante of figuraData.figura_corantes) {
    const totalCorante = corante.quantidade_corante * quantidade;
    
    const { data: coranteData } = await supabase
      .from("corantes")
      .select("quantidade")
      .eq("id_corante", corante.id_corante)
      .single();
    
    if (coranteData.quantidade < totalCorante) {
      return { 
        suficiente: false, 
        detalhes: {
          tipo: "corante",
          id: corante.id_corante,
          necessario: totalCorante,
          disponivel: coranteData.quantidade
        }
      };
    }
  }
  
  return { suficiente: true };
}

// Função auxiliar para subtrair do estoque
async function subtrairEstoque(idFigura, quantidade) {
  // Buscar informações da figura
  const { data: figuraData } = await supabase
    .from("figuras")
    .select(`
      id_materiasprima,
      quantidade_materia_prima,
      figura_corantes (id_corante, quantidade_corante)
    `)
    .eq("id_figura", idFigura)
    .single();
  
  // Subtrair matéria prima
  const totalMateriaPrima = figuraData.quantidade_materia_prima * quantidade;
  const { data: materiaPrimaData } = await supabase
    .from("materias_primas")
    .select("quantidade")
    .eq("id_materiasprima", figuraData.id_materiasprima)
    .single();
  
  await supabase
    .from("materias_primas")
    .update({ quantidade: materiaPrimaData.quantidade - totalMateriaPrima })
    .eq("id_materiasprima", figuraData.id_materiasprima);
  
  // Subtrair corantes
  for (const corante of figuraData.figura_corantes) {
    const totalCorante = corante.quantidade_corante * quantidade;
    
    const { data: coranteData } = await supabase
      .from("corantes")
      .select("quantidade")
      .eq("id_corante", corante.id_corante)
      .single();
    
    await supabase
      .from("corantes")
      .update({ quantidade: coranteData.quantidade - totalCorante })
      .eq("id_corante", corante.id_corante);
  }
}

// Função auxiliar para devolver ao estoque
async function devolverEstoque(idFigura, quantidade) {
  // Buscar informações da figura
  const { data: figuraData } = await supabase
    .from("figuras")
    .select(`
      id_materiasprima,
      quantidade_materia_prima,
      figura_corantes (id_corante, quantidade_corante)
    `)
    .eq("id_figura", idFigura)
    .single();
  
  // Devolver matéria prima
  const totalMateriaPrima = figuraData.quantidade_materia_prima * quantidade;
  const { data: materiaPrimaData } = await supabase
    .from("materias_primas")
    .select("quantidade")
    .eq("id_materiasprima", figuraData.id_materiasprima)
    .single();
  
  await supabase
    .from("materias_primas")
    .update({ quantidade: materiaPrimaData.quantidade + totalMateriaPrima })
    .eq("id_materiasprima", figuraData.id_materiasprima);
  
  // Devolver corantes
  for (const corante of figuraData.figura_corantes) {
    const totalCorante = corante.quantidade_corante * quantidade;
    
    const { data: coranteData } = await supabase
      .from("corantes")
      .select("quantidade")
      .eq("id_corante", corante.id_corante)
      .single();
    
    await supabase
      .from("corantes")
      .update({ quantidade: coranteData.quantidade + totalCorante })
      .eq("id_corante", corante.id_corante);
  }
}

export default router;