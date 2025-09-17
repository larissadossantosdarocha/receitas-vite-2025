const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todas as receitas
const readAll = async (req, res) => {
  try {
    const receitas = await prisma.receita.findMany();
    res.json(receitas);
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Buscar uma receita pelo id
const readOne = async (req, res) => {
  const { id } = req.params;
  try {
    const receita = await prisma.receita.findUnique({ where: { id: Number(id) } });
    if (!receita) return res.status(404).json({ error: "Receita não encontrada" });
    res.json(receita);
  } catch (error) {
    console.error("Erro ao buscar receita:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Criar nova receita
const create = async (req, res) => {
  try {
    const { nome, ingredientes, modoFazer, img } = req.body;

    if (!nome || !ingredientes || !modoFazer) {
      return res.status(400).json({ error: "Envio de dados inválidos" });
    }

    const novaReceita = await prisma.receita.create({
      data: { 
        nome, 
        ingredientes: Array.isArray(ingredientes) ? ingredientes.join(', ') : ingredientes,
        modoFazer, 
        img
      },
    });

    res.status(201).json(novaReceita);
  } catch (error) {
    console.error("Erro ao criar receita:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Atualizar parcialmente uma receita
const update = async (req, res) => {
  const { id } = req.params;
  try {
    const { nome, ingredientes, modoFazer, img } = req.body;

    const data = {};
    if (nome) data.nome = nome;
    if (ingredientes) data.ingredientes = Array.isArray(ingredientes) ? ingredientes.join(', ') : ingredientes;
    if (modoFazer) data.modoFazer = modoFazer;
    if (img) data.img = img;

    const receitaAtualizada = await prisma.receita.update({
      where: { id: Number(id) },
      data
    });

    res.status(200).json(receitaAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar receita:", error);
    res.status(400).json({ error: "Receita não encontrada ou dados inválidos" });
  }
};

// Deletar receita
const del = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.receita.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar receita:", error);
    res.status(400).json({ error: "Receita não encontrada ou não foi possível deletar" });
  }
};

module.exports = { readAll, readOne, create, update, del };
