import express from 'express';
import supabase from '../config/db.js';

const router = express.Router();

// Endpoint para buscar todos os turnos
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("turnos").select("*");

  if (error) {
    console.error("Erro ao buscar turnos:", error);
    return res.status(500).json({ error: "Erro ao buscar turnos" });
  }
  res.json({ status: "success", data });
});

export default router;