import express from 'express';
import supabase from '../config/db.js';

const router = express.Router();

// Endpoint de login
router.post('/utilizadores', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.from("colaboradores")
    .select(`*`)
    .eq(`email`, email)
    .eq(`password`, password);
  
  if (error) {
    console.error('Erro ao executar query:', error);
    return res.status(500).json({ error: 'Erro ao buscar Utilizador' });
  }
  
  if (data.length > 0) {
    res.json({ status: 'success', data: data[0] });
  } else {
    res.status(401).json({ status: 'error', message: 'Credenciais inválidas' });
  }
});

export default router;