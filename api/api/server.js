const express = require('express');
const cors = require('cors');
const receitas = require('../src/controllers/receitas'); // caminho correto para o controller

const app = express();
app.use(cors());
app.use(express.json());

// Rotas da API
app.get('/receitas', receitas.readAll);           // Listar todas
app.get('/receitas/:id', receitas.readOne);       // Buscar por id
app.post('/receitas', receitas.create);           // Criar nova receita
app.put('/receitas/:id', receitas.update);        // Atualizar receita inteira
app.patch('/receitas/:id', receitas.update);      // Atualizar parcialmente
app.delete('/receitas/:id', receitas.del);        // Deletar receita

// Rota raiz para testar se API está rodando
app.get('/', (req, res) => res.send('API de Receitas funcionando!'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
