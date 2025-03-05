import express from 'express';
import supabase from '../config/db.js';

const router = express.Router();

// Endpoint para buscar todos os planos de trabalho com suas relações
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("plano_trabalho").select(`
    *,
    maquinas (nome),
    encomendas (id_encomenda, quantidade, figuras (nome)),
    colaboradores (nome)
  `);

  if (error) {
    console.error("Erro ao buscar planos de trabalho:", error);
    return res.status(500).json({ error: "Erro ao buscar planos de trabalho" });
  }
  
  res.json({ status: "success", data });
});

// Endpoint para adicionar um novo plano de trabalho
router.post("/", async (req, res) => {
  const { maquina_id, encomenda_id, id_colaborador, semana ,quantidade ,quantidade_falta } = req.body;
  console.log("📥 Dados recebidos na requisição:", req.body);

  const { dataEcomenda, error } = await supabase.from("encomendas").select(`
    *,
    figuras (tempo_ciclo)
  `).eq("id_encomenda", encomenda_id);

  console.log("🔍 Resultado da busca por encomenda:", dataEcomenda, error);
  const encomenda = dataEcomenda[0]; 
  console.log("📦 Encomenda encontrada:", encomenda);

  const tempo_conclusao = quantidade / dataEcomenda.figuras.tempo_ciclo;

  try {
    const { data, error } = await supabase
      .from("plano_trabalho")
      .insert([{ 
        maquina_id, 
        encomenda_id, 
        id_colaborador, 
        tempo_conclusao, 
        quantidade, 
        semana, 
        quantidade_falta 
      }])
      .select(`
        *,
        maquinas (nome),
        encomendas (id_encomenda, quantidade, figuras (nome)),
        colaboradores (nome)
      `)
      .single();

    if (error) {
      console.error("Erro ao adicionar plano de trabalho:", error);
      return res.status(500).json({ error: "Erro ao adicionar plano de trabalho" });
    }
    
    res.status(201).json({ status: "success", data });
  } catch (error) {
    console.error("Erro durante o processamento do plano de trabalho:", error);
    return res.status(500).json({ error: "Erro durante o processamento do plano de trabalho" });
  }
});

// Endpoint para eliminar um plano de trabalho
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const { error } = await supabase
      .from("plano_trabalho")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Erro ao excluir plano de trabalho:", error);
      return res.status(500).send("Erro interno do servidor");
    }
    
    res.status(200).json({ 
      status: "success", 
      message: "Plano de trabalho excluído com sucesso" 
    });
  } catch (error) {
    console.error("Erro ao processar exclusão do plano de trabalho:", error);
    return res.status(500).json({ error: "Erro ao processar exclusão do plano de trabalho" });
  }
});

// Endpoint para atualizar um plano de trabalho
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { maquina_id, encomenda_id, id_colaborador, tempo_conclusao, quantidade, semana, quantidade_falta } = req.body;

  try {
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

    if (error) {
      console.error("Erro ao atualizar plano de trabalho:", error);
      return res.status(500).send("Erro interno do servidor");
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao processar atualização do plano de trabalho:", error);
    return res.status(500).json({ error: "Erro ao processar atualização do plano de trabalho" });
  }
});

export default router;