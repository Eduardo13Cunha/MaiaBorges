const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const db = require('./database/connection');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const supabaseUrl ='https://womzetihjapjkstdqget.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbXpldGloamFwamtzdGRxZ2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4MzU2NzMsImV4cCI6MjA1NDQxMTY3M30.1_cttJ5d48-85uCtmZYc7QsZYKWPoFOfxmo4xG6vZEE'
const supabase = createClient(supabaseUrl, supabaseKey)

app.use(cors());
app.use(bodyParser.json());

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'itparkmanager.pap@gmail.com',
      pass: 'obek yzjf drgc jtuc'
  }
});

// Endpoint para enviar e-mail
app.post('/api/send-email', (req, res) => {
  const { sugestao } = req.body;
  const mailOptions = {
      from: 'itparkmanager.pap@gmail.com',
      to: 'eduardocunha302988@rauldoria.pt',
      subject: 'Nova Opinião Recebida',
      text: sugestao
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return res.status(500).send(error.toString());
      }
      res.status(200).send('E-mail enviado: ' + info.response);
  });
});

// Endpoint de login
app.post('/api/utilizadores', async (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM utilizadores WHERE email = ? AND palavra_passe = ?';
  db.query(query, [email, password.trim()], (err, results) => {
    if (err) {
      console.error('Erro ao executar query:', err);
      return res.status(500).json({ error: 'Erro ao buscar Utilizador' });
    }
    if (results.length > 0) {
      res.json({ status: 'success', data: results[0] });
    } else {
      res.status(401).json({ status: 'error', message: 'Credenciais inválidas' });
    }
  });
});

//<-----------------------------------------------------TURNOS----------------------------------------------------->
// Endpoint para buscar todos os turnos
app.get("/api/turno", async (req, res) => {
  const { data, error } = await supabase.from("turnos").select("*");

  if (error) {
    console.error("Erro ao buscar turnos:", error);
    return res.status(500).json({ error: "Erro ao buscar turnos" });
  }
  res.json({ status: "success", data });
});

//<-----------------------------------------------------COLABORADORES----------------------------------------------------->
// Endpoint para buscar todos os colaboradores com informações do turno
app.get("/api/colaborador", async (req, res) => {
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
app.post("/api/colaborador", async (req, res) => {
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
app.delete("/api/colaborador/:id", async (req, res) => {
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
app.put("/api/colaborador/:id", async (req, res) => {
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

//<-----------------------------------------------------CLIENTES----------------------------------------------------->
// Endpoint para buscar todos os clientes
app.get("/api/cliente", async (req, res) => {
  const { data, error } = await supabase.from("clientes").select("*");

  if (error) {
    console.error("Erro ao buscar clientes:", error);
    return res.status(500).json({ error: "Erro ao buscar clientes" });
  }
  res.json({ status: "success", data });
});

// Endpoint para adicionar um novo cliente
app.post("/api/cliente", async (req, res) => {
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
app.delete("/api/cliente/:id", async (req, res) => {
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
app.put("/api/cliente/:id", async (req, res) => {
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

//<-----------------------------------------------------MATERIAS PRIMAS----------------------------------------------------->
// Endpoint para buscar todas as materias primas
app.get("/api/materiasprima", async (req, res) => {
  const { data, error } = await supabase.from("materias_primas").select("*");

  if (error) {
    console.error("Erro ao buscar materias primas:", error);
    return res.status(500).json({ error: "Erro ao buscar materias primas" });
  }
  res.json({ status: "success", data });
});

// Endpoint para adicionar uma nova materia prima
app.post("/api/materiasprima", async (req, res) => {
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
app.delete("/api/materiasprima/:id", async (req, res) => {
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
app.put("/api/materiasprima/:id", async (req, res) => {
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

//<-----------------------------------------------------CORANTES----------------------------------------------------->
// Endpoint para buscar todos os corantes
app.get("/api/corante", async (req, res) => {
  const { data, error } = await supabase.from("corantes").select("*");

  if (error) {
    console.error("Erro ao buscar corantes:", error);
    return res.status(500).json({ error: "Erro ao buscar corantes" });
  }
  res.json({ status: "success", data });
});

// Endpoint para adicionar um novo corante
app.post("/api/corante", async (req, res) => {
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
app.delete("/api/corante/:id", async (req, res) => {
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
app.put("/api/corante/:id", async (req, res) => {
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

//<-----------------------------------------------------MÁQUINAS----------------------------------------------------->
// Endpoint para buscar todas as máquinas
app.get("/api/maquina", async (req, res) => {
  const { data, error } = await supabase.from("maquinas").select("*");

  if (error) {
    console.error("Erro ao buscar máquinas:", error);
    return res.status(500).json({ error: "Erro ao buscar máquinas" });
  }
  res.json({ status: "success", data });
});

// Endpoint para adicionar uma nova máquina
app.post("/api/maquina", async (req, res) => {
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
app.delete("/api/maquina/:id", async (req, res) => {
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
app.put("/api/maquina/:id", async (req, res) => {
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

//<-----------------------------------------------------FIGURAS E CORANTES------------------------------------------------------>
// Endpoint para buscar todas as figuras com suas relações de corantes
app.get("/api/figura", async (req, res) => {
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
app.post("/api/figura", async (req, res) => {
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
app.delete("/api/figura/:id", async (req, res) => {
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
app.put("/api/figura/:id", async (req, res) => {
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


//<-----------------------------------------------------ENCOMENDAS----------------------------------------------------->
// Endpoint para buscar todas as encomendas com suas relações
app.get("/api/encomenda", async (req, res) => {
  const { data, error } = await supabase.from("encomendas").select(`
      *,
      figuras (nome),
      clientes (nome)
    `);

  if (error) {
    console.error("Erro ao buscar encomendas:", error);
    return res.status(500).json({ error: "Erro ao buscar encomendas" });
  }
  res.json({ status: "success", data });
});

// Endpoint para adicionar uma nova encomenda
app.post("/api/encomenda", async (req, res) => {
  const { id_figura, id_cliente, quantidade, data_inicio, data_fim } = req.body;
  const { data, error } = await supabase
    .from("encomendas")
    .insert([{ id_figura, id_cliente, quantidade, data_inicio, data_fim }])
    .select(
      `
      *,
      figuras (nome),
      clientes (nome)
    `
    )
    .single();

  if (error) {
    console.error("Erro ao adicionar encomenda:", error);
    return res.status(500).json({ error: "Erro ao adicionar encomenda" });
  }
  res.status(201).json({ status: "success", data });
});

// Endpoint para eliminar uma encomenda
app.delete("/api/encomenda/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("encomendas").delete().eq("id_ecomenda", id);

  if (error) {
    console.error("Erro ao excluir encomenda:", error);
    return res.status(500).send("Erro interno do servidor");
  }
  res.status(204).send();
});

// Endpoint para atualizar uma encomenda
app.put("/api/encomenda/:id", async (req, res) => {
  const { id } = req.params;
  const { id_figura, id_cliente, quantidade, data_inicio, data_fim } = req.body;

  const { data, error } = await supabase
    .from("encomendas")
    .update({ id_figura, id_cliente, quantidade, data_inicio, data_fim })
    .eq("id_encomenda", id)
    .select(
      `
      *,
      figuras (nome),
      clientes (nome)
    `
    )
    .single();

  if (error) {
    console.error("Erro ao atualizar encomenda:", error);
    return res.status(500).send("Erro interno do servidor");
  }
  res.status(200).json(data);
});

//<-----------------------------------------------------INICIALIZAÇÃO DO SERVIDOR----------------------------------------------------->
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});