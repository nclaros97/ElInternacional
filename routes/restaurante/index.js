// Importar los módulos requeridos
const express = require("express");
const restauranteController = require("../../controllers/RestauranteController");
const mongoose = require("mongoose");
const Restaurante = mongoose.model("Restaurantes");

const { json } = require("express");
const passport = require("passport");
// Configura y mantiene todos los endpoints en el servidor
const router = express.Router();
const authController = require("../../controllers/authController");

module.exports = () => {

  router.use(async function (req, res, next) {
    const { check } = require("express-validator");
    if (req.user != null) {
      if (req.user.roles.includes("restaurante") && true) {

       
        // Rutas disponibles
        router.get("/ordenes", (req, res, next) => {
          res.send("Restaurantes No implementado!");
        });

        // Ver todos los items
        router.get("/:id/items", restauranteController.vistaItems);

        // vista modificar item
        router.get("/:id/items/:url", restauranteController.vistaEditarItems);

        // Crear item
        router.post("/:id/items/nuevo/item", restauranteController.subirImagen,
          [
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

        //modificar item
        router.post("/:id/items/:url",restauranteController.subirImagen, restauranteController.EditarItems);


        // eliminar item
        router.post("/:restaurante/items/:item/eliminarItem", async (req, res, next) => {
          const editar = {
            $pop: {"items.$":{_id:req.params.item}}
          }
          await Restaurante.updateOne({"items._id":req.params.item},editar);
          res.redirect("/restaurantes/" + req.params.restaurante + "/items");
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
        router.get("/lista-restaurantes", async (req, res, next) => {
          let tipo = "";
          if (req.user != null) {
            tipo = req.user.roles;
          }
          let pagActual = 'Inicio';
          let login = false;
          if (req.user != undefined) { login = true }

          // Obtener todos los restaurantes disponibles
          const restaurantes = await Restaurante.find({ userId: req.user._id }).lean();
          let rutaImg = `/public/uploads/items`;
          res.render("administracion/restaurantes/adminRestaurantes/restaurantes", {
            title: "El Internacional - Administracion de restaurantes",
            layout: "admin",
            login,
            tipo,
            pagActual,
            restaurantes,
            rutaImg,
            rutaBase: "restaurantes/",
            year: new Date().getFullYear(),
          });
        });

        router.get("/:url", async (req, res, next) => {
          //obtener restaurante por url
          const restaurante = await Restaurante.findOne({ url: req.params.url }).lean();
          let tipo = "";
          if (req.user != null) {
            tipo = req.user.roles;
          }
          let pagActual = 'Inicio';
          let login = false;
          if (req.user != undefined) { login = true }

          let rutaImg = `/uploads/items`;
          res.render("administracion/restaurantes/adminRestaurantes/editarRestaurante", {
            title: "El Internacional - Administracion de restaurantes",
            layout: "admin",
            login,
            tipo,
            pagActual,
            restaurante,
            rutaImg,
            rutaBase: "restaurantes/",
            year: new Date().getFullYear(),
          });
        });

        router.post("/:id/:accion", async (req, res, next) => {
          const messages = [];
          if (req.params.accion == "eliminarRestaurante") {
            const restaurante = Restaurante.findById(req.params.id);
            if(restaurante){
              await Restaurante.deleteOne({ _id: req.params.id })
              messages.push({
                message: "Restaurante eliminado correctamente!",
                alertType: "success",
              });
              req.flash("messages", messages);
            }else{
              console.log("Error al borrar restaurante");
            }
            res.redirect("/restaurantes/lista-restaurantes");
          }
        });

        
        router.post("/editar", restauranteController.subirImagen,
          [
            check("nombre", "Debes ingresar el nombre del restaurante")
              .not()
              .isEmpty()
              .escape(),
            check("descripcion", "Debes ingresar la descripción del restaurante")
              .not()
              .isEmpty()
              .escape()
          ],
          restauranteController.editarRestaurante);

        // Formulario nuevo restaurante
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

        // Agregando nuevo restaurante
        router.post("/nuevo",
          restauranteController.subirImagen,
          [
            check("nombre", "Debes ingresar el nombre del restaurante")
              .not()
              .isEmpty()
              .escape(),
            check("descripcion", "Debes ingresar la descripción del restaurante")
              .not()
              .isEmpty()
              .escape()
          ],
          restauranteController.crearRestaurante
        );


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