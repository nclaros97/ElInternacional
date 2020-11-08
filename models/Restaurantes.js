// Importar los módulos requeridos
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const shortid = require("shortid");

const restauranteSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    rating: Number,
    aprox_delivery_time: Number,
    direccion: String,
    latitud: String,
    longitud: String,
    cargo_empaque: Number,
    delivery_type: Number,
    delivery_radio: Number,
    costo_repartir: Number,
    precio_minimo_orden: Number,
    imagen_url: String,
    url: {
        type: String,
        lowercase: true,
      },
    userId:{ 
       type: mongoose.Schema.ObjectId,
       ref: "Usuario",
       required: true,
    },
    items: [{
        nombre: String,
        descripcion: String,
        precio: Number,
        restaurante_id: { 
            type: mongoose.Schema.ObjectId,
            ref: "Restaurante",
            required: true,
         },
        imgurl: String,
    }],
    ordenes: [{
                fecha: Date,
                usuarioId: String,
                metodoPago: String,
                deliveryType: Number,
                deliveryId: { 
                    type: mongoose.Schema.ObjectId,
                    ref: "Usuario",
                    required: true,
                 },
                estado: Number,
                Total: Number,
                detalles: [{
                    ordenId: { 
                        type: mongoose.Schema.ObjectId,
                        ref: "Orden",
                        required: true,
                     },
                    itemId: { 
                        type: mongoose.Schema.ObjectId,
                        ref: "Item",
                        required: true,
                     },
                    cantidad: Number,    
                }],
    }],
});

// Hooks para generar la URL del restaurante
restauranteSchema.pre("save", function (next) {
    // Crear la URL
    const url = slug(this.nombre);
    this.url = `${url}-${shortid.generate()}`;
  
    next();
  });
  
  // Generar un índice para mejorar la búsqueda por el nombre del producto
  restauranteSchema.index({ nombre: "text" });

module.exports = mongoose.model("Restaurantes", restauranteSchema);