import express from 'express';
import supabase from '../config/db.js';

const router = express.Router();

// Endpoint para buscar todas as figuras com suas relações de corantes
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("figuras")
    .select(`
      *,
      materias_primas (nome),
      figura_corantes (quantidade_corante, corantes (id_corante,nome))
    `);

  if (error) {
    console.error("Erro ao buscar figuras:", error);
    return res.status(500).json({ error: "Erro ao buscar figuras" });
  }
  
  res.json({ status: "success", data });
});

// Endpoint para adicionar uma nova figura com corantes
router.post("/", async (req, res) => {
  const {
    referencia,
    nome,
    tempo_ciclo,
    id_materiasprima,
    quantidade_materia_prima,
    corantes, // Array de objetos com id_corante e quantidade_corante
  } = req.body;

  const { data, error } = await supabase
    .from("figuras")
    .insert([
      {
        referencia,
        nome,
        tempo_ciclo,
        id_materiasprima,
        quantidade_materia_prima,
      },
    ])
    .select(
      `
      *,
      materias_primas (nome)
    `
    )
    .single();

  if (error) {
    console.error("Erro ao adicionar figura:", error);
    return res.status(500).json({ error: "Erro ao adicionar figura" });
  }

  // Adicionar os corantes na tabela figura_corantes
  const figuraId = data.id_figura;
  const figuraCorantes = corantes.map(({ id_corante, quantidade_corante }) => ({
    id_figura: figuraId,
    id_corante,
    quantidade_corante,
  }));

  const { error: corantesError } = await supabase
    .from("figura_corantes")
    .insert(figuraCorantes);

  if (corantesError) {
    console.error("Erro ao adicionar corantes:", corantesError);
    return res.status(500).json({ error: "Erro ao adicionar corantes" });
  }

  res.status(201).json({ status: "success", data });
});

// Endpoint para eliminar uma figura e os corantes associados
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  // Excluir os registros de corantes associados à figura
  const { error: corantesError } = await supabase
    .from("figura_corantes")
    .delete()
    .eq("id_figura", id);

  if (corantesError) {
    console.error("Erro ao excluir corantes:", corantesError);
    return res.status(500).send("Erro interno ao excluir corantes");
  }

  // Excluir a figura
  const { error } = await supabase.from("figuras").delete().eq("id_figura", id);

  if (error) {
    console.error("Erro ao excluir figura:", error);
    return res.status(500).send("Erro interno do servidor");
  }

  res.status(204).send();
});

// Endpoint para atualizar uma figura e seus corantes
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    referencia,
    nome,
    tempo_ciclo,
    id_materiasprima,
    quantidade_materia_prima,
    corantes, // Array de objetos com id_corante e quantidade_corante
  } = req.body;

  // Atualizar os dados da figura
  const { data, error } = await supabase
    .from("figuras")
    .update({
      referencia,
      nome,
      tempo_ciclo,
      id_materiasprima,
      quantidade_materia_prima,
    })
    .eq("id_figura", id)
    .select(
      `
      *,
      materias_primas (nome)
    `
    )
    .single();

  if (error) {
    console.error("Erro ao atualizar figura:", error);
    return res.status(500).send("Erro interno do servidor");
  }

  // Atualizar ou adicionar corantes
  const { error: deleteCorantesError } = await supabase
    .from("figura_corantes")
    .delete()
    .eq("id_figura", id); // Excluir os corantes antigos

  if (deleteCorantesError) {
    console.error("Erro ao excluir corantes antigos:", deleteCorantesError);
    return res.status(500).send("Erro ao excluir corantes antigos");
  }

  // Inserir os novos corantes
  const figuraCorantes = corantes.map(({ id_corante, quantidade_corante }) => ({
    id_figura: id,
    id_corante,
    quantidade_corante,
  }));

  const { error: corantesError } = await supabase
    .from("figura_corantes")
    .insert(figuraCorantes);

  if (corantesError) {
    console.error("Erro ao atualizar corantes:", corantesError);
    return res.status(500).json({ error: "Erro ao atualizar corantes" });
  }

  res.status(200).json(data);
});

export default router;