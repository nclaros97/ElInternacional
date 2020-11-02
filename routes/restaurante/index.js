// Importar los módulos requeridos
const express = require("express");
const { check } = require("express-validator");

// Configura y mantiene todos los endpoints en el servidor
const router = express.Router();

module.exports = () => {
    // Rutas disponibles
    router.get("/ordenes", (req, res, next) => {
      res.send("Restaurantes No implementado!");
    });

    // Rutas disponibles
    router.get("/all", (req, res, next) => {
      res.send("Restaurantes No implementado!");
    });

    // Rutas disponibles
    router.get("/all-own", (req, res, next) => {
      res.send("Restaurantes No implementado!");
    });

    // Rutas disponibles
    router.get("/orden/:id", (req, res, next) => {
      res.send("Restaurantes No implementado!");
    });

    // Rutas disponibles
    router.put("/aceptar-orden/:id", (req, res, next) => {
      res.send("Restaurantes No implementado!");
    });

    // Rutas disponibles
    router.put("/marcar-orden-listo/:id", (req, res, next) => {
      res.send("Restaurantes No implementado!");
    });

    // Rutas disponibles
    router.put("/cancelar-orden/:id", (req, res, next) => {
      res.send("Restaurantes No implementado!");
    });

    // Rutas disponibles
    router.put("/marcar-orden-entregada/:id", (req, res, next) => {
      res.send("Restaurantes No implementado!");
    });

    // Rutas disponibles
    router.get("/:id/items", (req, res, next) => {
      res.send("Restaurantes No implementado!");
    });

    // Rutas disponibles
    router.post("/:id/items/nuevo", (req, res, next) => {
      res.send("Restaurantes No implementado!");
    });

    // Rutas disponibles
    router.put("/:idRes/items/editar/:id", (req, res, next) => {
      res.send("Restaurantes No implementado!");
    });

    // Rutas disponibles
    router.delete("/:idRes/items/eliminar/:id", (req, res, next) => {
      res.send("Restaurantes No implementado!");
    });

    // Rutas disponibles
    router.post("/crear-restaurante", (req, res, next) => {
      res.send("Restaurantes No implementado!");
    });
    return router;
    };