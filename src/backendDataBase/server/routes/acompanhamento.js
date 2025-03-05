import express from 'express';
import supabase from '../config/db.js';

const router = express.Router();

// Endpoint para buscar todos os acompanhamentos com suas relações
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("acompanhamento").select(`
    *,
    maquinas (nome),
    encomendas (id_encomenda, quantidade, figuras (nome)),
    colaboradores (nome)
  `);

  if (error) {
    console.error("Erro ao buscar acompanhamentos:", error);
    return res.status(500).json({ error: "Erro ao buscar acompanhamentos" });
  }
  
  res.json({ status: "success", data });
});

// Endpoint para adicionar um novo acompanhamento
router.post("/", async (req, res) => {
  const { maquina_id, encomenda_id, id_colaborador, quantidade_produzida } = req.body;
  
  try {
    const { data, error } = await supabase
      .from("acompanhamento")
      .insert([{ 
        maquina_id, 
        encomenda_id, 
        id_colaborador, 
        quantidade_produzida 
      }])
      .select(`
        *,
        maquinas (nome),
        encomendas (id_encomenda, quantidade, figuras (nome)),
        colaboradores (nome)
      `)
      .single();

    if (error) {
      console.error("Erro ao adicionar acompanhamento:", error);
      return res.status(500).json({ error: "Erro ao adicionar acompanhamento" });
    }
    
    // Atualizar a quantidade_falta no plano de trabalho correspondente
    const { data: planoTrabalho, error: planoError } = await supabase
      .from("plano_trabalho")
      .select("quantidade, quantidade_falta")
      .eq("encomenda_id", encomenda_id)
      .eq("maquina_id", maquina_id)
      .single();
    
    if (planoError) {
      console.error("Erro ao buscar plano de trabalho:", planoError);
    } else if (planoTrabalho) {
      // Calcular nova quantidade em falta
      const novaQuantidadeFalta = Math.max(0, planoTrabalho.quantidade_falta - quantidade_produzida);
      
      // Atualizar o plano de trabalho
      const { error: updateError } = await supabase
        .from("plano_trabalho")
        .update({ quantidade_falta: novaQuantidadeFalta })
        .eq("encomenda_id", encomenda_id)
        .eq("maquina_id", maquina_id);
      
      if (updateError) {
        console.error("Erro ao atualizar plano de trabalho:", updateError);
      }
    }
    
    res.status(201).json({ status: "success", data });
  } catch (error) {
    console.error("Erro durante o processamento do acompanhamento:", error);
    return res.status(500).json({ error: "Erro durante o processamento do acompanhamento" });
  }
});

// Endpoint para eliminar um acompanhamento
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    // Obter informações do acompanhamento antes de excluí-lo
    const { data: acompanhamento, error: getError } = await supabase
      .from("acompanhamento")
      .select("encomenda_id, maquina_id, quantidade_produzida")
      .eq("id", id)
      .single();
    
    if (getError) {
      console.error("Erro ao buscar informações do acompanhamento:", getError);
      return res.status(500).json({ error: "Erro ao buscar informações do acompanhamento" });
    }
    
    // Excluir o acompanhamento
    const { error } = await supabase
      .from("acompanhamento")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Erro ao excluir acompanhamento:", error);
      return res.status(500).send("Erro interno do servidor");
    }
    
    // Atualizar a quantidade_falta no plano de trabalho correspondente
    if (acompanhamento) {
      const { data: planoTrabalho, error: planoError } = await supabase
        .from("plano_trabalho")
        .select("quantidade_falta")
        .eq("encomenda_id", acompanhamento.encomenda_id)
        .eq("maquina_id", acompanhamento.maquina_id)
        .single();
      
      if (planoError) {
        console.error("Erro ao buscar plano de trabalho:", planoError);
      } else if (planoTrabalho) {
        // Adicionar a quantidade produzida de volta à quantidade em falta
        const novaQuantidadeFalta = planoTrabalho.quantidade_falta + acompanhamento.quantidade_produzida;
        
        // Atualizar o plano de trabalho
        const { error: updateError } = await supabase
          .from("plano_trabalho")
          .update({ quantidade_falta: novaQuantidadeFalta })
          .eq("encomenda_id", acompanhamento.encomenda_id)
          .eq("maquina_id", acompanhamento.maquina_id);
        
        if (updateError) {
          console.error("Erro ao atualizar plano de trabalho:", updateError);
        }
      }
    }
    
    res.status(200).json({ 
      status: "success", 
      message: "Acompanhamento excluído com sucesso" 
    });
  } catch (error) {
    console.error("Erro ao processar exclusão do acompanhamento:", error);
    return res.status(500).json({ error: "Erro ao processar exclusão do acompanhamento" });
  }
});

// Endpoint para atualizar um acompanhamento
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { maquina_id, encomenda_id, id_colaborador, quantidade_produzida } = req.body;

  try {
    // Obter informações do acompanhamento antes de atualizá-lo
    const { data: acompanhamentoAntigo, error: getError } = await supabase
      .from("acompanhamento")
      .select("encomenda_id, maquina_id, quantidade_produzida")
      .eq("id", id)
      .single();
    
    if (getError) {
      console.error("Erro ao buscar informações do acompanhamento:", getError);
      return res.status(500).json({ error: "Erro ao buscar informações do acompanhamento" });
    }
    
    // Atualizar o acompanhamento
    const { data, error } = await supabase
      .from("acompanhamento")
      .update({ 
        maquina_id, 
        encomenda_id, 
        id_colaborador, 
        quantidade_produzida 
      })
      .eq("id", id)
      .select(`
        *,
        maquinas (nome),
        encomendas (id_encomenda, quantidade, figuras (nome)),
        colaboradores (nome)
      `)
      .single();

    if (error) {
      console.error("Erro ao atualizar acompanhamento:", error);
      return res.status(500).send("Erro interno do servidor");
    }
    
    // Atualizar a quantidade_falta no plano de trabalho correspondente
    if (acompanhamentoAntigo) {
      // Se a encomenda ou máquina mudou, precisamos atualizar ambos os planos de trabalho
      if (acompanhamentoAntigo.encomenda_id !== encomenda_id || acompanhamentoAntigo.maquina_id !== maquina_id) {
        // Atualizar o plano antigo (adicionar a quantidade produzida de volta)
        const { data: planoAntigo, error: planoAntigoError } = await supabase
          .from("plano_trabalho")
          .select("quantidade_falta")
          .eq("encomenda_id", acompanhamentoAntigo.encomenda_id)
          .eq("maquina_id", acompanhamentoAntigo.maquina_id)
          .single();
        
        if (!planoAntigoError && planoAntigo) {
          const novaQuantidadeFaltaAntigo = planoAntigo.quantidade_falta + acompanhamentoAntigo.quantidade_produzida;
          
          await supabase
            .from("plano_trabalho")
            .update({ quantidade_falta: novaQuantidadeFaltaAntigo })
            .eq("encomenda_id", acompanhamentoAntigo.encomenda_id)
            .eq("maquina_id", acompanhamentoAntigo.maquina_id);
        }
        
        // Atualizar o novo plano (subtrair a nova quantidade produzida)
        const { data: planoNovo, error: planoNovoError } = await supabase
          .from("plano_trabalho")
          .select("quantidade_falta")
          .eq("encomenda_id", encomenda_id)
          .eq("maquina_id", maquina_id)
          .single();
        
        if (!planoNovoError && planoNovo) {
          const novaQuantidadeFaltaNovo = Math.max(0, planoNovo.quantidade_falta - quantidade_produzida);
          
          await supabase
            .from("plano_trabalho")
            .update({ quantidade_falta: novaQuantidadeFaltaNovo })
            .eq("encomenda_id", encomenda_id)
            .eq("maquina_id", maquina_id);
        }
      } 
      // Se apenas a quantidade mudou, precisamos ajustar a diferença
      else if (acompanhamentoAntigo.quantidade_produzida !== quantidade_produzida) {
        const { data: planoTrabalho, error: planoError } = await supabase
          .from("plano_trabalho")
          .select("quantidade_falta")
          .eq("encomenda_id", encomenda_id)
          .eq("maquina_id", maquina_id)
          .single();
        
        if (!planoError && planoTrabalho) {
          // Calcular a diferença e ajustar a quantidade em falta
          const diferenca = quantidade_produzida - acompanhamentoAntigo.quantidade_produzida;
          const novaQuantidadeFalta = Math.max(0, planoTrabalho.quantidade_falta - diferenca);
          
          await supabase
            .from("plano_trabalho")
            .update({ quantidade_falta: novaQuantidadeFalta })
            .eq("encomenda_id", encomenda_id)
            .eq("maquina_id", maquina_id);
        }
      }
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao processar atualização do acompanhamento:", error);
    return res.status(500).json({ error: "Erro ao processar atualização do acompanhamento" });
  }
});

export default router;