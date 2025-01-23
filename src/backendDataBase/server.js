const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const db = require('./database/connection');

const app = express();

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

// Endpoint para buscar Estados da Tarefa
app.get('/api/estadostarefa', (req, res) => {
  const query = 'SELECT * FROM estadotar';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao executar query:', err);
      return res.status(500).json({ error: 'Erro ao buscar Estados das Tarefas' });
    }
    res.json({ status: 'success', data: results });
  });
});

// Endpoint para buscar Prioridade da Tarefa
app.get('/api/prioridadetarefa', (req, res) => {
  const query = 'SELECT * FROM prioridade';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao executar query:', err);
      return res.status(500).json({ error: 'Erro ao buscar Estados das Tarefas' });
    }
    res.json({ status: 'success', data: results });
  });
});

// Endpoint para buscar Tarefa
app.get('/api/tarefa', (req, res) => {
  const query = 'SELECT id_tar,des_tar,tarefas.id_user,utilizadores.nome,tarefas.id_pri,prioridade.des_pri,tarefas.id_esttar,estadotar.des_esttar,data_inicio,data_acaba FROM tarefas,utilizadores,estadotar,prioridade Where tarefas.id_user=utilizadores.id_user AND tarefas.id_esttar=estadotar.id_esttar AND tarefas.id_pri=prioridade.id_pri'; // Altere para o nome correto da tabela
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar Tarefas' });
    }
    res.json({ status: 'success', data: results });
  });
});

// Endpoint para adicionar Tarefa
app.post('/api/tarefa', (req, res) => {
  let { des_tar, id_user, id_pri, data_inicio, data_acaba, id_esttar } = req.body;
  if (!des_tar || !id_user || !id_pri|| !data_inicio || !id_esttar) {
    return res.status(400).send('Todos os campos obrigatórios devem ser preenchidos.');
  }
  if (data_acaba==''){data_acaba=null}
  const query = 'INSERT INTO tarefas (des_tar, id_user,id_pri,data_inicio, data_acaba, id_esttar) VALUES (?, ?,?, ?, ?, ?)';
  db.query(query, [des_tar, id_user,id_pri, data_inicio, data_acaba, id_esttar], (error, results) => {
    if (error) {
      console.error('Erro ao adicionar tarefa:', error);
      return res.status(500).send('Erro interno do servidor');
    }
  })
});

// Endpoint para atualizar uma Tarefa
app.put('/api/tarefa/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).send('ID inválido');
  }
  const { id_esttar, data_acaba } = req.body;
  // Atualiza a tarefa
  db.query(
    'UPDATE tarefas SET id_esttar = ?, data_acaba = ? WHERE id_tar = ?',
    [id_esttar, data_acaba, id],
    (error, results) => {
      if (error) {
        console.error('Erro ao atualizar tarefa:', error);
        return res.status(500).send('Erro interno do servidor');
      }

      if (results.affectedRows === 0) {
        return res.status(404).send('Tarefa não encontrada');
      }
      const selectQuery = 'SELECT id_tar,des_tar,tarefas.id_user,utilizadores.nome,tarefas.id_esttar,estadotar.des_esttar,data_inicio,data_acaba FROM tarefas,utilizadores,estadotar Where tarefas.id_user=utilizadores.id_user AND tarefas.id_esttar=estadotar.id_esttar'; // Altere para o nome correto da tabela
      db.query(selectQuery, [id], (err, tarefaResults) => {
        if (err || tarefaResults.length === 0) {
          console.error('Erro ao buscar dados do tarefa:', err);
          return res.status(500).json({ error: 'Erro ao buscar dados do tarefa' });
        }

        const tarefa = tarefaResults[0];
        res.status(200).json({
          status: 'success',
          data: {
            id_tar: tarefa.id_tar,
            des_tar: tarefa.des_tar,
            id_user: tarefa.id_user,
            nome: tarefa.nome,
            data_inicio: tarefa.data_inicio,
            data_acaba: tarefa.data_acaba,
            id_esttar: tarefa.id_esttar,
            des_esttar: tarefa.des_esttar
          }
        });
      });
    }
  );
});

// Endpoint para buscar técnicos
app.get('/api/tecnicos', (req, res) => {
  const query = 'SELECT * FROM tecnicos'; // Altere para o nome correto da tabela
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao executar query:', err);
      return res.status(500).json({ error: 'Erro ao buscar técnicos' });
    }
    res.json({ status: 'success', data: results });
  });
});

// Endpoint para adicionar um novo técnico
app.post('/api/tecnicos', (req, res) => {
  const { nome, idade, email, numero } = req.body;
  const query = 'INSERT INTO tecnicos (nome, idade, email, numero) VALUES (?, ?, ?, ?)'; // Altere para o nome correto da tabela

  db.query(query, [nome, idade, email, numero], (err, results) => {
    if (err) {
      console.error('Erro ao adicionar técnico:', err);
      return res.status(500).json({ error: 'Erro ao adicionar técnico' });
    }
    res.status(201).json({ status: 'success', data: { id_tec: results.insertId, nome, idade, email, numero } });
  });
});

// Endpoint para eliminar um novo técnico
app.delete('/api/tecnicos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
      return res.status(400).send('ID inválido'); // Retorna um erro se o ID não for um número
  }

  db.query('DELETE FROM tecnicos WHERE id_tec = ?', [id], (error, results) => {
    if (error) {
        console.error('Erro ao excluir tecnico:', error);
        return res.status(500).send('Erro interno do servidor');
    }
    if (results.affectedRows === 0) {
        return res.status(404).send('Técnico não encontrado');
    }
    res.status(204).send(); // No Content
  });
});

// Endpoint para atualizar um técnico
app.put('/api/tecnicos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
      return res.status(400).send('ID inválido');
  }
  const { nome, idade, email, numero } = req.body;
  db.query('UPDATE tecnicos SET nome = ?, idade = ?, email = ?, numero = ? WHERE id_tec = ?', [nome, idade, email, numero, id], (error, results) => {
    if (error) {
        console.error('Erro ao atualizar técnico:', error);
        return res.status(500).send('Erro interno do servidor');
    }
    if (results.affectedRows === 0) {
        return res.status(404).send('Técnico não encontrado');
    }
    const updatedTecnico = { id_tec: id, nome, idade, email, numero };
    res.status(200).json(updatedTecnico); // Retorna o técnico atualizado
  });
});

// Endpoint para buscar Locais
app.get('/api/local', (req, res) => {
  const query = 'SELECT id_loc,des_loc,local.id_tec,nome FROM local,tecnicos Where local.id_tec=tecnicos.id_tec'; // Altere para o nome correto da tabela
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao executar query:', err);
      return res.status(500).json({ error: 'Erro ao buscar Locais' });
    }
    res.json({ status: 'success', data: results });
  });
});

// Endpoint para adicionar Locais
app.post('/api/local', (req, res) => {
  const {des_loc, id_tec } = req.body;
  if (isNaN(id_tec)) {
    return res.status(400).send('ID inválido');
  }
  const query = 'INSERT INTO local (des_loc, id_tec) VALUES (?, ?)';
  db.query(query, [des_loc, id_tec], (err, results) => {
    if (err) {
      console.error('Erro ao adicionar local:', err);
      return res.status(500).json({ error: 'Erro ao adicionar local' });
    }
    const selectQuery = 'SELECT nome FROM tecnicos WHERE id_tec = ?';
    db.query(selectQuery, [id_tec], (err, techResults) => {
      const technicianName = techResults[0].nome;
      res.status(201).json({ status: 'success', data: { id_loc: results.insertId, des_loc, nome: technicianName} });
    });
  });
});

// Endpoint para Eliminar Locais
app.delete('/api/local/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
      return res.status(400).send('ID inválido'); // Retorna um erro se o ID não for um número
  }

  db.query('DELETE FROM local WHERE id_loc = ?', [id], (error, results) => {
    if (error) {
        console.error('Erro ao excluir local:', error);
        return res.status(500).send('Erro interno do servidor');
    }
    if (results.affectedRows === 0) {
        return res.status(404).send('Local não encontrado');
    }
    res.status(204).send(); // No Content
  });
});

// Endpoint para atualizar um local
app.put('/api/local/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
      return res.status(400).send('ID inválido');
  }
  const { des_loc, id_tec} = req.body;
  db.query('UPDATE local SET des_loc = ?, id_tec = ? WHERE id_loc = ?', [des_loc, id_tec, id], (error, results) => {
    if (error) {
        console.error('Erro ao atualizar local:', error);
        return res.status(500).send('Erro interno do servidor');
    }
    if (results.affectedRows === 0) {
        return res.status(404).send('Local não encontrado');
    }
    const selectQuery = 'SELECT nome FROM tecnicos WHERE id_tec = ?';
    db.query(selectQuery, [id_tec], (err, techResults) => {
      const nome = techResults[0].nome;
      const updatedLocal = { id_loc: id, des_loc,id_tec, nome};
      res.status(200).json(updatedLocal);
    });
  });
});


// Endpoint para buscar Estados do Equipamento
app.get('/api/estadosequipamento', (req, res) => {
  const query = 'SELECT * FROM estadoequi';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao executar query:', err);
      return res.status(500).json({ error: 'Erro ao buscar Estados dos equipamentos' });
    }
    res.json({ status: 'success', data: results });
  });
});

// Endpoint para buscar Equipamento
app.get('/api/equipamento', (req, res) => {
  const query = 'SELECT id_equi,tipo,equipamentos.id_loc,local.des_loc,equipamentos.id_estequi,estadoequi.des_est,licensa,validade_licensa,data_compra,data_final,observações FROM equipamentos,local,estadoequi Where equipamentos.id_loc=local.id_loc AND equipamentos.id_estequi=estadoequi.id_estequi'; // Altere para o nome correto da tabela
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao executar query:', err);
      return res.status(500).json({ error: 'Erro ao buscar Locais' });
    }
    res.json({ status: 'success', data: results });
  });
});

// Endpoint para adicionar Equipamento
app.post('/api/equipamento', (req, res) => {
  const {tipo, id_loc,id_estequi,licensa,validade_licensa,data_compra,data_final,observações } = req.body;
  if (isNaN(id_loc) || isNaN(id_estequi)) {
    return res.status(400).send('ID inválido');
  }
  const query = 'INSERT INTO equipamentos (tipo, id_loc,id_estequi,licensa,validade_licensa,data_compra,data_final,observações) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [tipo, id_loc, id_estequi, licensa, validade_licensa, data_compra, data_final, observações], (err, results) => {
    if (err) {
      console.error('Erro ao adicionar equipamento:', err);
      return res.status(500).json({ error: 'Erro ao adicionar equipamento' });
    }
    const selectQuery = 'SELECT id_equi,tipo,equipamentos.id_loc,local.des_loc,equipamentos.id_estequi,estadoequi.des_est,licensa,validade_licensa,data_compra,data_final,observações FROM equipamentos,local,estadoequi Where equipamentos.id_loc=local.id_loc AND equipamentos.id_estequi=estadoequi.id_estequi AND id_equi = ?'; // Altere para o nome correto da tabela
    db.query(selectQuery, [results.insertId], (err, equipamentoResults) => {
      if (err || equipamentoResults.length === 0) {
        console.error('Erro ao buscar dados do equipamento:', err);
        return res.status(500).json({ error: 'Erro ao buscar dados do equipamento' });
      }
      const equipamento = equipamentoResults[0];
      res.status(201).json({
        status: 'success',
        data: {
          id_equi: equipamento.id_equi,
          tipo: equipamento.tipo,
          id_loc: equipamento.id_loc,
          des_loc: equipamento.des_loc,
          id_estequi: equipamento.id_estequi,
          des_est: equipamento.des_est,
          licensa: equipamento.licensa,
          validade_licensa: equipamento.validade_licensa,
          data_compra: equipamento.data_compra,
          data_final: equipamento.data_final,
          observações: equipamento.observações
        }
      });
    });
  });
});

// Endpoint para Eliminar Equipamento
app.delete('/api/equipamento/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
      return res.status(400).send('ID inválido'); // Retorna um erro se o ID não for um número
  }

  db.query('DELETE FROM equipamentos WHERE id_equi = ?', [id], (error, results) => {
    if (error) {
        console.error('Erro ao excluir equipamento:', error);
        return res.status(500).send('Erro interno do servidor');
    }
    if (results.affectedRows === 0) {
        return res.status(404).send('Equipamento não encontrado');
    }
    res.status(204).send(); // No Content
  });
});

// Endpoint para atualizar um Equipamento
app.put('/api/equipamento/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).send('ID inválido');
  }

  const { tipo, id_loc, id_estequi, licensa, validade_licensa, data_compra, data_final, observações } = req.body;

  // Atualiza o equipamento
  db.query(
    'UPDATE equipamentos SET tipo = ?, id_loc = ?, id_estequi = ?, licensa = ?, validade_licensa = ?, data_compra = ?, data_final = ?, observações = ? WHERE id_equi = ?',
    [tipo, id_loc, id_estequi, licensa, validade_licensa, data_compra, data_final, observações, id],
    (error, results) => {
      if (error) {
        console.error('Erro ao atualizar equipamento:', error);
        return res.status(500).send('Erro interno do servidor');
      }

      if (results.affectedRows === 0) {
        return res.status(404).send('Equipamento não encontrado');
      }

      // Busca os dados do equipamento atualizado
      const selectQuery = `
        SELECT 
          id_equi, tipo, equipamentos.id_loc, local.des_loc, 
          equipamentos.id_estequi, estadoequi.des_est, 
          licensa, validade_licensa, data_compra, data_final, observações 
        FROM 
          equipamentos 
        JOIN local ON equipamentos.id_loc = local.id_loc 
        JOIN estadoequi ON equipamentos.id_estequi = estadoequi.id_estequi 
        WHERE 
          id_equi = ?`;

      db.query(selectQuery, [id], (err, equipamentoResults) => {
        if (err || equipamentoResults.length === 0) {
          console.error('Erro ao buscar dados do equipamento:', err);
          return res.status(500).json({ error: 'Erro ao buscar dados do equipamento' });
        }

        const equipamento = equipamentoResults[0];
        res.status(200).json({
          status: 'success',
          data: {
            id_equi: equipamento.id_equi,
            tipo: equipamento.tipo,
            id_loc: equipamento.id_loc,
            des_loc: equipamento.des_loc,
            id_estequi: equipamento.id_estequi,
            des_est: equipamento.des_est,
            licensa: equipamento.licensa,
            validade_licensa: equipamento.validade_licensa,
            data_compra: equipamento.data_compra,
            data_final: equipamento.data_final,
            observações: equipamento.observações
          }
        });
      });
    }
  );
});

// Endpoint para buscar Fornecedor
app.get('/api/fornecedor', (req, res) => {
  const query = 'SELECT * FROM fornecedores'; // Altere para o nome correto da tabela
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao executar query:', err);
      return res.status(500).json({ error: 'Erro ao buscar fornecedores' });
    }
    res.json({ status: 'success', data: results });
  });
});

// Endpoint para adicionar um novo Fornecedor
app.post('/api/fornecedor', (req, res) => {
  const { nome, email, numero, n_contribuinte } = req.body;
  const query = 'INSERT INTO fornecedores (nome, email, numero, n_contribuinte) VALUES (?, ?, ?, ?)'; // Altere para o nome correto da tabela

  db.query(query, [nome, email, numero, n_contribuinte], (err, results) => {
    if (err) {
      console.error('Erro ao adicionar fornecedor:', err);
      return res.status(500).json({ error: 'Erro ao adicionar fornecedor' });
    }
    res.status(201).json({ status: 'success', data: { id_for: results.insertId, nome, email, numero, n_contribuinte} });
  });
});

// Endpoint para eliminar um novo Fornecedor
app.delete('/api/fornecedor/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
      return res.status(400).send('ID inválido'); // Retorna um erro se o ID não for um número
  }

  db.query('DELETE FROM fornecedores WHERE id_for = ?', [id], (error, results) => {
    if (error) {
        console.error('Erro ao excluir fornecedor:', error);
        return res.status(500).send('Erro interno do servidor');
    }
    if (results.affectedRows === 0) {
        return res.status(404).send('Fornecedor não encontrado');
    }
    res.status(204).send(); // No Content
  });
});

// Endpoint para atualizar um Fornecedor
app.put('/api/fornecedor/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
      return res.status(400).send('ID inválido');
  }
  const { nome, email, numero, n_contribuinte } = req.body;
  db.query('UPDATE fornecedores SET nome = ?, email = ?, numero = ?, n_contribuinte = ? WHERE id_for = ?', [nome, email, numero, n_contribuinte, id], (error, results) => {
    if (error) {
        console.error('Erro ao atualizar fornecedor:', error);
        return res.status(500).send('Erro interno do servidor');
    }
    if (results.affectedRows === 0) {
        return res.status(404).send('Fornecedor não encontrado');
    }
    const updatedFornecedor = { id_for: id, nome, email, numero, n_contribuinte };
    res.status(200).json(updatedFornecedor); // Retorna o Fornecedor atualizado
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});