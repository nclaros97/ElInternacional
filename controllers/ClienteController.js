
// Importar los módulos requeridos
const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuarios");
const Restaurante = mongoose.model("Restaurantes");
const Carrito = mongoose.model("Cliente");
const { validationResult } = require("express-validator");
const multer = require("multer");
const shortid = require("shortid");
let datosCarrito = require("../viewModels/carrito");
const year = new Date().getFullYear();


// Crear un item
exports.agregarCarrito = async (req, res, next) => {
  console.log("Agregar Carrito");
  let carrito;
  let carrito2;
  carrito = await Carrito.findOne({ userId: req.user._id }).lean();
  if (carrito) {
    console.log(carrito);
    
  } else {
    let userId = req.user._id;

    await Carrito.create({ userId });
    carrito = await Carrito.findOne({ userId: req.user._id }).lean();
  }

  let item = await Restaurante.findOne({ _id: req.params.restaurante }, { items: { $elemMatch: { url: req.params.url } } }, { url: req.params.url }).populate("items").lean();
  let itemObtenido;
  if (item != undefined) {
    itemObtenido = item.items[0]
  };
  let itemId = itemObtenido._id;
  let cantidad = 1;
  let fechaIngreso = Date.now();
  let lastUpdate = Date.now();
  const agregar = {
    $push: { detalleCarrito: { itemId, cantidad, fechaIngreso, lastUpdate } }
  }
  await Carrito.updateOne({ _id: carrito._id }, agregar);
  let restaurante = await Restaurante.findOne({ _id: req.params.restaurante });
  res.redirect("/" + restaurante.url);
};

exports.verCarrito = async (req, res, next) => {

  let tipo = "";
  if (req.user != null) {
    tipo = req.user.roles;
  }
  let pagActual = 'Inicio';
  let login = false;
  if (req.user != undefined) { login = true }
  const Itemscarrito = await Carrito.findOne({ userId: req.user._id }).lean();
  if(Itemscarrito){
    var mostrar = new Array();
    Itemscarrito.detalleCarrito.forEach(async platillo =>{
      let platilloRestaurante = await Restaurante.findOne({"items._id":platillo.itemId},{items :{$elemMatch:{_id:platillo.itemId}}}).populate("items").lean();
      if(platilloRestaurante){
        datosCarrito = {
          platillo:platilloRestaurante.items[0].nombre,
          cantidad:platillo.cantidad,
          precio: platilloRestaurante.items[0].precio,
          total: platilloRestaurante.items[0].precio*platillo.cantidad,
          imagen: platilloRestaurante.items[0].imgurl,
          _id:platilloRestaurante.items[0]._id
        };
        mostrar.push(datosCarrito);
      }
      
      
    }); 
  }
  let carritoItems = await Carrito.findOne({userId:req.user._id}).lean();
  res.render("cliente/carrito", {
    title: "El Internacional - Carrito",
    layout: "frontend",
    login,
    tipo,
    cantidad: carritoItems ? carritoItems.detalleCarrito.length : 0,
    mostrarDatos:await mostrar,
    pagActual,
    rutaBase: "clientes/",
    year: new Date().getFullYear(),
  });
};

// Agregar un platillo
exports.agregarUno = async (req, res, next) => {
  console.log("Agregar 1 platillo al carrito existente");
  await Carrito.updateOne({"detalleCarrito.itemId":req.params.id},{$inc:{"detalleCarrito.$.cantidad":1}});

  res.redirect("/clientes/carrito");
};

// Quitar 1 platillo
exports.quitarUno = async (req, res, next) => {
  console.log("Quitar un platillo del carrito");
  const platillo = await Carrito.updateOne({"detalleCarrito.itemId":req.params.id},{$inc:{"detalleCarrito.$.cantidad":-1}});
  
  res.redirect("/clientes/carrito");
};