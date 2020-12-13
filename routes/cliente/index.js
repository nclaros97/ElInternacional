// Importar los módulos requeridos
const express = require("express");
const restauranteController = require("../../controllers/RestauranteController");
const carritoController = require("../../controllers/ClienteController");
const mongoose = require("mongoose");
const Restaurante = mongoose.model("Restaurantes");

const { json } = require("express");
const passport = require("passport");
// Configura y mantiene todos los endpoints en el servidor
const authController = require("../../controllers/authController");

// Configura y mantiene todos los endpoints en el servidor
const router = express.Router();

module.exports = () => {
    // Rutas disponibles
    router.get("/agregar-carrito/:url",(req, res, next) => {
        res.send("No implementado!");
      });

    return router;
    };