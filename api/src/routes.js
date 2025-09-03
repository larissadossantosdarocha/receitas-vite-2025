const express = require("express");
const routes = express.Router();

routes.get("/",(req, res)=>{
    res.json({
        message: "API de Receitas",
        routes:[
            { method: "GET", path: "/receitas", description: "Listar todas as receitas" },
            { method: "GET", path: "/receitas/:id", description: "Buscar receita por ID" },
            { method: "POST", path: "/receitas", description: "Criar nova receita" },
            { method: "PATCH", path: "/receitas/:id", description: "Atualizar receita por ID" },
            { method: "DELETE", path: "/receitas/:id", description: "Deletar receita por ID" }
        ]
    });
})

const Receitas = require("./controllers/receitas");

routes.get("/receitas", Receitas.readAll);
routes.get("/receitas/:id", Receitas.readOne);
routes.post("/receitas", Receitas.create);
routes.patch("/receitas/:id", Receitas.update);
routes.delete("/receitas/:id", Receitas.del);

module.exports = routes;