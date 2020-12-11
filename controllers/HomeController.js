// Importar los módulos requeridos
const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuarios");
const Restaurante = mongoose.model("Restaurantes");

const { validationResult } = require("express-validator");
const multer = require("multer");
const shortid = require("shortid");

const year = new Date().getFullYear();

// Mostrar el formulario de creación de items
exports.itemsRestaurante = async (req, res, next) => {
    let tipo = "";
    if(req.user != null){
      tipo = req.user.roles;
    }
    let pagActual = 'Inicio';
    let login = false;
    if(req.user != undefined){login=true}
    let restaurante = await Restaurante.findOne({url: req.params.restaurante}).lean();

    res.render("cliente/itemsRestaurante", {
        title: "El Internacional - Administracion Items",
        layout: "frontend",
        login,
        tipo,
        restaurante,
        pagActual,
        rutaBase:"restaurantes/",
        year: new Date().getFullYear(),
    });
  };