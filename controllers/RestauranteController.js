// Importar los módulos requeridos
const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuarios");
const Restaurante = mongoose.model("Restaurantes");

const { validationResult } = require("express-validator");
const multer = require("multer");
const shortid = require("shortid");

const year = new Date().getFullYear();

// Mostrar el formulario de creación de items
exports.formularioCrearItem = (req, res, next) => {
    res.render("administracion/restaurantes/items/crear-items", {
      year,
    });
  };

exports.vistaItems = async (req, res, next) =>{

    let tipo = "";
    if(req.user != null){
      tipo = req.user.roles;
    }
    let pagActual = 'Inicio';
    let login = false;
    if(req.user != undefined){login=true}
    const restaurante = await Restaurante.findOne({url: req.params.id}).lean();
    res.render("administracion/restaurantes/items/items", {
        title: "El Internacional - Administracion Items",
        layout: "admin",
        login,
        tipo,
        restaurante,
        id:restaurante._id,
        pagActual,
        rutaBase:"restaurantes/",
        year: new Date().getFullYear(),
      });
};

exports.vistaEditarItems = async (req, res, next) =>{
  let tipo = "";
  if(req.user != null){
    tipo = req.user.roles;
  }
  let pagActual = 'Inicio';
  let login = false;
  if(req.user != undefined){login=true}


  let item = await Restaurante.findOne({url:req.params.id},{items : {$elemMatch:{url:req.params.url}}},{url:req.params.url}).lean();
  let itemObtenido;
  if(item != undefined){
   itemObtenido =item.items[0]
  };
  res.render("administracion/restaurantes/items/editarItem", {
      title: "El Internacional - Editar Item",
      layout: "admin",
      login,
      tipo,
      itemObtenido,
      pagActual,
      rutaBase:"restaurantes/",
      year: new Date().getFullYear(),
    });
};

// editar un item
exports.EditarItems = async (req, res, next) => {
  console.log("Editar Item");
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
      let item = await Restaurante.findOne({url:req.params.id},{items : {$elemMatch:{url:req.params.url}}},{url:req.params.url}).lean();
      let itemObtenido;
      if(item != undefined){
      itemObtenido =item.items[0]
      };
      if(req.file != undefined){
       imgurl = req.file.filename;
      }else{
        console.log(itemObtenido.imgurl);
        if(itemObtenido.imgurl){
          imgurl = itemObtenido.imgurl;
        }else{
          imgurl = "no-image-default.png";
        }
      }

      
      
      const editar = {
        $set: {"items.$":{nombre,descripcion,precio,restaurante_id,imgurl}}
      }
      await Restaurante.updateOne({"items.url":req.params.url},editar);

      messages.push({
        message: "Item modificado correctamente!",
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

// Crear un item
exports.crearItem = async (req, res, next) => {
    console.log("Crear item");
    let restaurante = await Restaurante.findOne({url:req.params.id}).lean();
    console.log(restaurante);
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

// Crear un restaurante
exports.crearRestaurante = async (req, res, next) => {
  // Verificar que no existen errores de validación
  const errores = validationResult(req);
  const messages = [];
  console.log(errores);
  // Si hay errores
  if (!errores.isEmpty()) {
    errores.array().map((error) => {
      messages.push({ message: error.msg, alertType: "danger" });
    });

    // Enviar los errores a través de flash messages
    req.flash("messages", messages);

    res.redirect("lista-restaurantes");
  } else {
    // Almacenar los valores del restaurante
    try {
      const { 
        nombre,
        descripcion,
        rating,
        aprox_delivery_time, 
        direccion,
        latitud,
        longitud,
        cargo_empaque,
        delivery_type,
        delivery_radio,
        costo_repartir,
        precio_minimo_orden,
         } = req.body;
      let imagen = "";
      if(req.file != undefined){
        imagen = req.file.filename;
      }else{
        imagen = "no-image-default.png";
      }
      await Restaurante.create({
        nombre,
        descripcion,
        rating,
        aprox_delivery_time, 
        direccion,
        latitud,
        longitud,
        cargo_empaque,
        delivery_type,
        delivery_radio,
        costo_repartir,
        precio_minimo_orden,
        imagen_url: imagen,
        userId: req.user._id,
      });

      messages.push({
        message: "Restaurante agregado correctamente!",
        alertType: "success",
      });
      req.flash("messages", messages);

      res.redirect("lista-restaurantes");
    } catch (error) {
      console.log(error);
      messages.push({
        message: error,
        alertType: "danger",
      });
      req.flash("messages", messages);
      res.redirect("lista-restaurantes");
    }
  }
};

// Crear un restaurante
exports.editarRestaurante = async (req, res, next) => {
  // Verificar que no existen errores de validación
  const errores = validationResult(req);
  const messages = [];
  console.log(errores);
  // Si hay errores
  if (!errores.isEmpty()) {
    errores.array().map((error) => {
      messages.push({ message: error.msg, alertType: "danger" });
    });

    // Enviar los errores a través de flash messages
    req.flash("messages", messages);

    res.redirect("lista-restaurantes");
  } else {
    // Almacenar los valores del restaurante
    try {
      const { 
        nombre,
        descripcion,
        rating,
        aprox_delivery_time, 
        direccion,
        latitud,
        longitud,
        cargo_empaque,
        delivery_type,
        delivery_radio,
        costo_repartir,
        precio_minimo_orden,
         } = req.body;

         
        let filter = { _id: req.body._id };
        let restaurante = await Restaurante.findOne(filter)
        let imagen = "";
         if(req.file != undefined){
          imagen = req.file.filename;
         }else{
           imagen = restaurante.imagen_url
         }
      await Restaurante.updateOne(filter,{nombre,
        descripcion,
        rating,
        aprox_delivery_time, 
        direccion,
        latitud,
        longitud,
        cargo_empaque,
        delivery_type,
        delivery_radio,
        costo_repartir,
        precio_minimo_orden,
        imagen_url: imagen,
        userId: req.user._id,});

      messages.push({
        message: "Restaurante agregado correctamente!",
        alertType: "success",
      });
      req.flash("messages", messages);

      res.redirect("lista-restaurantes");
    } catch (error) {
      console.log(error);
      messages.push({
        message: error,
        alertType: "danger",
      });
      req.flash("messages", messages);
      res.redirect("lista-restaurantes");
    }
  }
  
};

  // Permite subir un archivo (imagen) al servidor
exports.subirImagen = (req, res, next) => {
  //verificar si existe archivo
    upload(req, res, function (error) {
      if (error) {
        // Errores de Multer
        if (error instanceof multer.MulterError) {
          if (error.code === "LIMIT_FILE_SIZE") {
            req.flash("messages", [
              {
                message:
                  "El tamaño del archivo es superior al límite. Máximo 300Kb",
                alertType: "danger",
              },
            ]);
          } else {
            req.flash("messages", [
              { message: error.message, alertType: "danger" },
            ]);
          }
        } else {
          // Errores creado por el usuario
          req.flash("messages", [
            { message: error.message, alertType: "danger" },
          ]);
        }
        // Redireccionar y mostrar el error
        res.redirect("/");
        return;
      } else {
        // Archivo cargado correctamente
        return next();
      }
    });
};


// Opciones de configuración para multer en productos
const configuracionMulter = {
    // Tamaño máximo del archivo en bytes
    limits: {
      fileSize: 3000000,
    },
    // Dónde se almacena el archivo
    storage: (fileStorage = multer.diskStorage({
      destination: (req, res, cb) => {
        cb(null, `${__dirname}../../public/uploads/items`);
      },
      filename: (req, file, cb) => {
        // Construir el nombre del archivo
        // iphone.png --> image/png --> ["image", "png"]
        // iphone.jpg --> image/jpeg
        const extension = file.mimetype.split("/")[1];
        cb(null, `${shortid.generate()}.${extension}`);
      },
    })),
    // Verificar el tipo de archivo mediante el mime type
    // https://developer.mozilla.org/es/docs/Web/HTTP/Basics_of_HTTP/MIME_types
    fileFilter(req, file, cb) {
      if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
        // Si el callback retorne true se acepta el tipo de archivo
        cb(null, true);
      } else {
        cb(
          new Error(
            "Formato de archivo no válido. Solamente se permniten JPEG/JPG o PNG"
          ),
          false
        );
      }
    },
  };
// Función que sube el archivo
const upload = multer(configuracionMulter).single("imagen_url");
