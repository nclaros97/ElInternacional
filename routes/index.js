// Importar los módulos requeridos
const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const authController = require("../controllers/authController");
const { check } = require("express-validator");
const { json } = require("express");
const passport = require("passport");

// Configura y mantiene todos los endpoints en el servidor
const router = express.Router();

module.exports = () => {
// Rutas disponibles
router.get("/", (req, res, next) => {
  console.log(req.isAuthenticated());
  if(req.user != undefined || req.isAuthenticated()){
    if(req.user.roles.includes('cliente')){
      res.redirect("/home");
    }
    if(req.user.roles.includes('restaurante')){
      res.redirect("/home");
    }
    if(req.user.roles.includes('delivery')){
      res.redirect("/home");
    }
  }else{
    res.render("home", {
      title: "El Internacional",
      layout: "landingpage",
      login:false
    });
  }
  
});

router.get("/home", (req,res,next)=>{
  let tipo = "";
  if(req.user != null){
    tipo = req.user.roles;
  }
  let pagActual = 'Inicio';
  let login = false;
  if(req.user != undefined){login=true}
  res.render("cliente/home", {
    title: "El Internacional",
    layout: "frontend",
    login,
    tipo,
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

// Rutas de administración
router.get("/administrar", (req, res, next) => {
  res.send("Administración del sitio");
});
return router;
};

