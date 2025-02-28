import axios from 'axios';
import express from 'express';
import supabase from '../config/db.js';

const router = express.Router(); 

// Endpoint para buscar todos os corantes
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("corantes").select("*");

  if (error) {
    console.error("Erro ao buscar corantes:", error);
    return res.status(500).json({ error: "Erro ao buscar corantes" });
  }
  
  res.json({ status: "success", data });
});

// Endpoint para adicionar um novo corante
router.post("/", async (req, res) => {
  const { nome, quantidade } = req.body;
  const { data, error } = await supabase
    .from("corantes")
    .insert([{ nome, quantidade }])
    .select()
    .single();

  if (error) {
    console.error("Erro ao adicionar corante:", error);
    return res.status(500).json({ error: "Erro ao adicionar corante" });
  }
  
  res.status(201).json({ status: "success", data });
});

// Endpoint para eliminar um corante
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from("corantes")
    .delete()
    .eq("id_corante", id);

  if (error) {
    console.error("Erro ao excluir corante:", error);
    return res.status(500).send("Erro interno do servidor");
  }
  
  res.status(204).send();
});

// Endpoint para atualizar um corante
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, quantidade } = req.body;

  const { data, error } = await supabase
    .from("corantes")
    .update({ nome, quantidade })
    .eq("id_corante", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar corante:", error);
    return res.status(500).send("Erro interno do servidor");
  }
  
  res.status(200).json(data);
});

export default router;