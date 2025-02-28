import express from 'express';
import supabase from '../config/db.js';

const router = express.Router();

// Endpoint para buscar todos os clientes
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("clientes").select("*");

  if (error) {
    console.error("Erro ao buscar clientes:", error);
    return res.status(500).json({ error: "Erro ao buscar clientes" });
  }
  
  res.json({ status: "success", data });
});

// Endpoint para adicionar um novo cliente
router.post("/", async (req, res) => {
  const { nome, email, numero } = req.body;
  const { data, error } = await supabase
    .from("clientes")
    .insert([{ nome, email, numero }])
    .select()
    .single();

  if (error) {
    console.error("Erro ao adicionar cliente:", error);
    return res.status(500).json({ error: "Erro ao adicionar cliente" });
  }
  
  res.status(201).json({ message: "Cliente adicionado com sucesso", data });
});

// Endpoint para eliminar um cliente
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from("clientes")
    .delete()
    .eq("id_cliente", id);

  if (error) {
    console.error("Erro ao excluir cliente:", error);
    return res.status(500).send("Erro interno do servidor");
  }
  
  res.status(204).send();
});

// Endpoint para atualizar um cliente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, numero } = req.body;

  const { data, error } = await supabase
    .from("clientes")
    .update({ nome, email, numero })
    .eq("id_cliente", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar cliente:", error);
    return res.status(500).send("Erro interno do servidor");
  }
  
  res.status(200).json(data);
});

export default router;