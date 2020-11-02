// Importar los módulos requeridos
const express = require("express");
const { check } = require("express-validator");

// Configura y mantiene todos los endpoints en el servidor
const router = express.Router();

module.exports = () => {
    // Rutas disponibles
    router.get("/restaurantes", (req, res, next) => {
      res.send("restaurantes No implementado!");
    });

    // Rutas disponibles
    router.get("/:idRest/items", (req, res, next) => {
      res.send("¡No implementado!");
    });

    // Rutas disponibles
    router.get("/:idRest/item/:id", (req, res, next) => {
      res.send("¡No implementado!");
    });

     // Rutas disponibles
     router.post("/agregar-item/:itemId", (req, res, next) => {
      res.send("¡No implementado!");
    });

     // Rutas disponibles
     router.delete("/elimintar-item/:itemId", (req, res, next) => {
      res.send("¡No implementado!");
    });

     // Rutas disponibles
     router.get("/ordenes/all", (req, res, next) => {
      res.send("¡No implementado!");
    });

     // Rutas disponibles
     router.get("/carrito", (req, res, next) => {
      res.send("¡No implementado!");
    });

     // Rutas disponibles
     router.post("/crear-orden", (req, res, next) => {
      res.send("¡No implementado!");
    });

     // Rutas disponibles
     router.get("/orden/:id", (req, res, next) => {
      res.send("¡No implementado!");
    });


    return router;
    };