
// Importar los módulos requeridos
const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuarios");
const Restaurante = mongoose.model("Restaurantes");
const Carrito = mongoose.model("Cliente");
const { validationResult } = require("express-validator");
const multer = require("multer");
const shortid = require("shortid");

const year = new Date().getFullYear();


// Crear un item
exports.agregarCarrito = async (req, res, next) => {
    console.log("Agregar Carrito");
    let restaurante = await Restaurante.findOne({url:req.params.id}).lean();

    // Verificar que no existen errores de validación
    const errores = validationResult(req);
    const messages = [];
  
    // Si hay errores
    if (!errores.isEmpty()) {
      errores.array().map((error) => {
        messages.push({ message: error.msg, alertType: "danger" });
      });
  
      // Enviar los errores a través de flash messages
      req.flash("messages", messages);
      res.redirect("/restaurantes/"+restaurante.url+"/items");
    } else {
      // Almacenar los valores del item
      try {
        const { nombre, descripcion, precio, restaurante_id } = req.body;
        let imgurl = "";
        if(req.file != undefined){
         imgurl = req.file.filename;
        }else{
          let item = await Restaurante.findOne();
        if(item.imgurl){
          imgurl = item.imgurl;
        }else{
          imgurl = "no-image-default.png";
        }
        }

        
        const agregar = {
          $push: {items:{nombre,descripcion,precio,restaurante_id,imgurl}}
        }
        await Restaurante.updateOne({url:req.params.id},agregar);
  
        messages.push({
          message: "Item agregado correctamente!",
          alertType: "success",
        });
        req.flash("messages", messages);
  
        res.redirect("/restaurantes/"+restaurante.url+"/items");
      } catch (error) {
        console.log(error);
        messages.push({
          message: error,
          alertType: "danger",
        });
        req.flash("messages", messages);
        res.redirect("/restaurantes/"+restaurante.url+"/items");
      }
    }
  };