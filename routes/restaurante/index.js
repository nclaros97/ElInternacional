// Importar los módulos requeridos
const express = require("express");
const { check } = require("express-validator");
const restauranteController = require("../../controllers/RestauranteController");
// Configura y mantiene todos los endpoints en el servidor
const router = express.Router();

module.exports = () => {

  router.use(async function (req, res, next) {

    if (req.user != null) {
      if (req.user.roles.includes("restaurante") && true) {

        // Rutas disponibles
        router.get("/perfil", (req, res, next) => {
          let tipo = "";
          if (req.user != null) {
            tipo = req.user.roles;
          }
          let pagActual = 'Inicio';
          let login = false;
          if (req.user != undefined) { login = true }
          res.render("administracion/restaurantes/perfil", {
            title: "El Internacional - Perfil",
            layout: "admin",
            login,
            tipo,
            pagActual,
            rutaBase: "restaurantes/",
            year: new Date().getFullYear(),
          });
        });


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
        router.get("/items", restauranteController.vistaItems);

        // Rutas disponibles
        router.get("/items/nuevo", restauranteController.vistaCrearItems);

        // Rutas disponibles
        router.post("/items/nuevo", [
          check("nombre", "Debes ingresar el nombre del producto")
            .not()
            .isEmpty()
            .escape(),
          check("descripcion", "Debes ingresar la descripción del producto")
            .not()
            .isEmpty()
            .escape(),
          check("precio", "Debes ingresar el precio del producto")
            .not()
            .isEmpty()
            .escape(),
          check("precio", "Valor incorrecto en el precio del producto").isNumeric(),
        ],
          restauranteController.crearItem);

        // Rutas disponibles
        router.put("/:idRes/items/editar/:id", (req, res, next) => {
          res.send("Restaurantes No implementado!");
        });

        // Rutas disponibles
        router.delete("/:idRes/items/eliminar/:id", (req, res, next) => {
          res.send("Restaurantes No implementado!");
        });

        // Rutas disponibles
        router.get("/escritorio", (req, res, next) => {
          let tipo = "";
          if (req.user != null) {
            tipo = req.user.roles;
          }
          let pagActual = 'Inicio';
          let login = false;
          if (req.user != undefined) { login = true }
          res.render("administracion/restaurantes/adminRestaurantes/escritorio", {
            title: "El Internacional - Escritorio",
            layout: "admin",
            login,
            tipo,
            pagActual,
            rutaBase: "restaurantes/",
            year: new Date().getFullYear(),
          });
        });

        // Rutas disponibles
        router.get("/lista-restaurantes", (req, res, next) => {
          let tipo = "";
          if (req.user != null) {
            tipo = req.user.roles;
          }
          let pagActual = 'Inicio';
          let login = false;
          if (req.user != undefined) { login = true }
          res.render("administracion/restaurantes/adminRestaurantes/restaurantes", {
            title: "El Internacional - Administracion Items",
            layout: "admin",
            login,
            tipo,
            pagActual,
            rutaBase: "restaurantes/",
            year: new Date().getFullYear(),
          });
        });

        // Rutas disponibles
        router.get("/nuevo", (req, res, next) => {
          let tipo = "";
          if (req.user != null) {
            tipo = req.user.roles;
          }
          let pagActual = 'Inicio';
          let login = false;
          if (req.user != undefined) { login = true }
          res.render("administracion/restaurantes/adminRestaurantes/CrearNuevo", {
            title: "El Internacional - Administracion Items",
            layout: "admin",
            login,
            tipo,
            pagActual,
            rutaBase: "restaurantes/",
            year: new Date().getFullYear(),
          });
        });
        // Rutas disponibles
        router.post("/nuevo", [
          check("nombre", "Debes ingresar el nombre del producto")
            .not()
            .isEmpty()
            .escape(),
          check("descripcion", "Debes ingresar la descripción del producto")
            .not()
            .isEmpty()
            .escape()
        ],
          restauranteController.crearRestaurante);

      } else {
        res.redirect("/");
      }
    } else {
      res.redirect("/");
    }
    next();
  });
  return router;
};