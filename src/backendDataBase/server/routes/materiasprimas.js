import express from 'express';
import supabase from '../config/db.js';

const router = express.Router();

// Endpoint para buscar todas as materias primas
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("materias_primas").select("*");

  if (error) {
    console.error("Erro ao buscar materias primas:", error);
    return res.status(500).json({ error: "Erro ao buscar materias primas" });
  }
  
  res.json({ status: "success", data });
});

// Endpoint para adicionar uma nova materia prima
router.post("/", async (req, res) => {
  const { nome, quantidade } = req.body;
  const { data, error } = await supabase
    .from("materias_primas")
    .insert([{ nome, quantidade }])
    .select()
    .single();

  if (error) {
    console.error("Erro ao adicionar materia prima:", error);
    return res.status(500).json({ error: "Erro ao adicionar materia prima" });
  }
  
  res.status(201).json({ status: "success", data });
});

// Endpoint para eliminar uma materia prima
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from("materias_primas")
    .delete()
    .eq("id_materiasprima", id);

  if (error) {
    console.error("Erro ao excluir materia prima:", error);
    return res.status(500).send("Erro interno do servidor");
  }
  
  res.status(204).send();
});

// Endpoint para atualizar uma materia prima
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, quantidade } = req.body;

  const { data, error } = await supabase
    .from("materias_primas")
    .update({ nome, quantidade })
    .eq("id_materiasprima", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar materia prima:", error);
    return res.status(500).send("Erro interno do servidor");
  }
  
  res.status(200).json(data);
});

export default router;