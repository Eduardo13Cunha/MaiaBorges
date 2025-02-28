import express from 'express';
import supabase from '../config/db.js';

const router = express.Router();

// Endpoint para buscar todas as máquinas
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("maquinas").select("*");

  if (error) {
    console.error("Erro ao buscar máquinas:", error);
    return res.status(500).json({ error: "Erro ao buscar máquinas" });
  }
  
  res.json({ status: "success", data });
});

// Endpoint para adicionar uma nova máquina
router.post("/", async (req, res) => {
  const { nome, data_inicio, ultima_inspecao, proxima_inspecao } = req.body;
  const { data, error } = await supabase
    .from("maquinas")
    .insert([{ nome, data_inicio, ultima_inspecao, proxima_inspecao }])
    .select()
    .single();

  if (error) {
    console.error("Erro ao adicionar máquina:", error);
    return res.status(500).json({ error: "Erro ao adicionar máquina" });
  }
  
  res.status(201).json({ status: "success", data });
});

// Endpoint para eliminar uma máquina
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from("maquinas")
    .delete()
    .eq("id_maquina", id);

  if (error) {
    console.error("Erro ao excluir máquina:", error);
    return res.status(500).send("Erro interno do servidor");
  }
  
  res.status(204).send();
});

// Endpoint para atualizar uma máquina
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, data_inicio, ultima_inspecao, proxima_inspecao } = req.body;

  const { data, error } = await supabase
    .from("maquinas")
    .update({ nome, data_inicio, ultima_inspecao, proxima_inspecao })
    .eq("id_maquina", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar máquina:", error);
    return res.status(500).send("Erro interno do servidor");
  }
  
  res.status(200).json(data);
});

export default router;