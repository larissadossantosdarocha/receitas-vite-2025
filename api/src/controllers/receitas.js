const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const readAll = async (req, res) => {
    try {
        const receitas = await prisma.receita.findMany();
        res.json(receitas);
    } catch (error) {
        console.error("Erro ao buscar receitas:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

const readOne = async (req, res) => {
    const { id } = req.params;
    try {
        const receita = await prisma.receita.findUnique({ 
            where: { id: Number(id) }
        });
        if (!receita) {
            return res.status(404).json({ error: "Receita não encontrada" });
        }
        res.json(receita);
    } catch (error) {
        console.error("Erro ao buscar receita:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

const create = async (req, res) => {
    try {
        const novaReceita = await prisma.receita.create({ 
            data: req.body
        });
        res.status(201).json(novaReceita);
    } catch (error) {
        console.error("Erro ao criar receita:", error);
        res.status(400).json({ error: "Envio de dados inválidos" });
    }
};

const update = async (req, res) => {
    const { id } = req.params;
    try {
        const receitaAtualizada = await prisma.receita.update({
            where: { id: Number(id) },
            data: req.body
        });
        res.status(202).json(receitaAtualizada);
    } catch (error) {
        console.error("Erro ao atualizar receita:", error);
        res.status(400).json({ error: "Envio de dados inválidos" });
    }
};

const del = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.receita.delete({ 
            where: { id: Number(id) }
        });
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar receita:", error);
        res.status(400).json({ error: "Envio de dados inválidos" });
    }
};

module.exports = {
    readAll,
    readOne,
    create,
    update,
    del
};
