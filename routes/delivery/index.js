// Importar los módulos requeridos
const express = require("express");
const { check } = require("express-validator");

// Configura y mantiene todos los endpoints en el servidor
const router = express.Router();

module.exports = () => {
    // Rutas disponibles
    router.get("/pedidos", (req, res, next) => {
      res.send("No implementado!");
    });

    // Rutas disponibles
    router.get("/pedido/:id", (req, res, next) => {
      res.send("No implementado!");
    });
    
    // Rutas disponibles
    router.post("/pedido/:id", (req, res, next) => {
      res.send("No implementado!");
    });

    // Rutas disponibles
    router.put("/pedido/recoger-orden/:id", (req, res, next) => {
      res.send("No implementado!");
    });

    // Rutas disponibles
    router.put("/pedido/entregar-orden/:id", (req, res, next) => {
      res.send("No implementado!");
    });

    // Rutas disponibles
    router.get("/pedidos-aceptados", (req, res, next) => {
      res.send("No implementado!");
    });

    // Rutas disponibles
    router.get("/pedidos-aceptados/:id", (req, res, next) => {
      res.send("No implementado!");
    });
    return router;
    };