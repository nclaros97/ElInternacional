// Importar los módulos requeridos
const express = require("express");
const { check } = require("express-validator");

// Configura y mantiene todos los endpoints en el servidor
const router = express.Router();

module.exports = () => {
    // Rutas disponibles
    router.get("/", (req, res, next) => {
      res.send("¡Delivery No implementado!");
    });
    return router;
    };