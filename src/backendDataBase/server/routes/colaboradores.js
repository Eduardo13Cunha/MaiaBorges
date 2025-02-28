import express from 'express';
import supabase from '../config/db.js';

const router = express.Router();

// Endpoint para buscar todos os colaboradores com informações do turno
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("colaboradores").select(`
    id_colaborador,
    nome,
    email,
    numero,
    idade,
    data_nascimento,
    id_turno,
    turnos (descricao)
  `);
  
  if (error) {
    console.error("Erro ao buscar colaboradores:", error);
    return res.status(500).json({ error: "Erro ao buscar colaboradores" });
  }
  
  res.json({ status: "success", data });
});

// Endpoint para adicionar um novo colaborador
router.post("/", async (req, res) => {
  const { nome, idade, data_nascimento, email, numero, id_turno } = req.body;
  const { data, error } = await supabase
    .from("colaboradores")
    .insert([{ nome, idade, data_nascimento, email, numero, id_turno }])
    .select(
      `
      id_colaborador,
      nome,
      email,
      numero,
      idade,
      data_nascimento,
      id_turno,
      turnos (descricao)
    `
    )
    .single();

  if (error) {
    console.error("Erro ao adicionar colaborador:", error);
    return res.status(500).json({ error: "Erro ao adicionar colaborador" });
  }
  
  res.status(201).json({ status: "success", data });
});

// Endpoint para eliminar um colaborador
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from("colaboradores")
    .delete()
    .eq("id_colaborador", id);

  if (error) {
    console.error("Erro ao excluir colaborador:", error);
    return res.status(500).send("Erro interno do servidor");
  }
  
  res.status(204).send();
});

// Endpoint para atualizar um colaborador
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, idade, data_nascimento, email, numero, id_turno } = req.body;

  const { data3, error3 } = await supabase
    .from("colaboradores")
    .update({ nome, idade, data_nascimento, email, numero, id_turno })
    .eq("id_colaborador", id)
    .select()
    .single();
  
  const { data, error } = await supabase.from("colaboradores").select(`
    id_colaborador,
    nome,
    email,
    numero,
    idade,
    data_nascimento,
    id_turno,
    turnos (descricao)
  `) 
  .eq("id_colaborador", id);

  if (error) {
    console.error("Erro ao atualizar colaborador:", error);
    return res.status(500).send("Erro interno do servidor");
  }
  
  res.status(200).json(data);
});

export default router;