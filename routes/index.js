// Importar los módulos requeridos
const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const authController = require("../controllers/authController");
const homeController = require("../controllers/HomeController");
const { check } = require("express-validator");
const { json } = require("express");
const passport = require("passport");
const restaurante = require("./restaurante");
const Restaurantes = require("../models/Restaurantes");
const mongoose = require("mongoose");
const Restaurante = mongoose.model("Restaurantes");
const Carrito = mongoose.model("Cliente");
// Configura y mantiene todos los endpoints en el servidor
const router = express.Router();

module.exports = () => {
// Rutas disponibles
router.get("/", async (req, res, next) =>  {
  if(req.user != undefined || req.isAuthenticated()){
    if(req.user.roles.includes('cliente')){
      res.redirect("/inicio");
    }
    if(req.user.roles.includes('restaurante')){
      res.redirect("/restaurantes");
    }
    if(req.user.roles.includes('delivery')){
      res.redirect("/delivery");
    }
  }else{
    let restaurantes = await Restaurantes.find().lean();
    res.render("inicio", {
      title: "El Internacional",
      layout: "landingpage",
      restaurantes,
      login:false
    });
  }
  
});

router.get("/inicio", async (req,res,next)=>{
  let restaurantes;
  let carritoItems;
  let tipo = "";
  if(req.user != null){
    tipo = req.user.roles;
  }
  let pagActual = 'Inicio';
  let login = false;
  if(req.user != undefined){
    login=true;
     restaurantes = await Restaurantes.find().lean();
      carritoItems = await Carrito.findOne({userId:req.user._id}).lean();
  }
  
  res.render("cliente/inicio", {
    title: "El Internacional",
    layout: "frontend",
    login,
    restaurantes,
    tipo,
    cantidad: carritoItems ? carritoItems.detalleCarrito.length : 0,
    pagActual,
    year: new Date().getFullYear(),
  });
});

router.get("/restaurantes", (req,res,next)=>{
  let tipo = "";
  let rutaBase = "restaurantes/"
  if(req.user != null){
    tipo = req.user.roles;
  }
  let pagActual = 'Inicio';
  let login = false;
  if(req.user != undefined){login=true}
  res.render("administracion/restaurantes/inicio", {
    title: "El Internacional - Administracion Restaurantes",
    layout: "admin",
    login,
    tipo,
    rutaBase,
    pagActual,
    year: new Date().getFullYear(),
  });
});

router.get("/delivery", (req,res,next)=>{
  let tipo = "";
  let rutaBase = "delivery/"
  if(req.user != null){
    tipo = req.user.roles;
  }
  let pagActual = 'Inicio';
  let login = false;
  if(req.user != undefined){login=true}
  res.render("administracion/delivery/inicio", {
    title: "El Internacional - Administracion DElivery",
    layout: "admin",
    login,
    tipo,
    rutaBase,
    pagActual
  });
});

router.get("/cerrar-sesion",authController.cerrarSesion)

router.post(
  "/crear-cuenta",
  [
    // Realizar una verificación de los atributos del formulario
    // https://express-validator.github.io/docs/index.html
    check("nombre", "Debes ingresar tu nombre completo.")
      .not()
      .isEmpty()
      .escape(),
    check("email", "Debes ingresar un correo electrónico.").not().isEmpty(),
    check("email", "El correo electrónico ingresado no es válido.")
      .isEmail()
      .normalizeEmail(),
    check("password", "Debes ingresar una contraseña").not().isEmpty(),
  ],
  usuarioController.crearCuenta
);

router.post("/iniciar-sesion", authController.autenticarUsuario);

router.get("/olvide-password", authController.formularioRestablecerPassword);

router.post("/olvide-password", authController.enviarToken);

router.get("/olvide-password/:token", authController.formularioNuevoPassword);

router.post("/olvide-password/:token", authController.almacenarNuevaPassword);

// items del restaurante
router.get("/:restaurante",homeController.itemsRestaurante);




return router;
};

