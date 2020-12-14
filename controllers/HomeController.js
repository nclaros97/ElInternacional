// Importar los módulos requeridos
const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuarios");
const Restaurante = mongoose.model("Restaurantes");
const Carrito = mongoose.model("Cliente");
const { validationResult } = require("express-validator");
const multer = require("multer");
const shortid = require("shortid");

const year = new Date().getFullYear();

// Mostrar el formulario de creación de items
exports.itemsRestaurante = async (req, res, next) => {
    let tipo = "";
    let restaurante;
    let carritoItems;
    if(req.user != null){
      tipo = req.user.roles;
    }
    let pagActual = 'Inicio';
    let login = false;
    if(req.user != undefined){
      login=true;
       restaurante = await Restaurante.findOne({url: req.params.restaurante}).lean();
       carritoItems = await Carrito.findOne({userId:req.user._id}).lean();
    }
     
    res.render("cliente/itemsRestaurante", {
        title: "El Internacional - Administracion Items",
        layout: "frontend",
        login,
        tipo,
        restaurante,
        cantidad: carritoItems ? carritoItems.detalleCarrito.length : 0,
        pagActual,
        rutaBase:"restaurantes/",
        year: new Date().getFullYear(),
    });
  };