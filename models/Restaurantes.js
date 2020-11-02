// Importar los módulos requeridos
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const restauranteSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    rating: Number,
    aprox_delivery_time: Number,
    direccion: String,
    latitud: String,
    longitud: String,
    cargo_empaque: Number,
    delivery_tipe: Number,
    delivery_radio: Number,
    costo_repartir: Number,
    precio_minimo_orden: Number,
    imagen_url: String,
    userId: mongoose.Types.ObjectId,
    items: [{
        nombre: String,
        descripcion: String,
        precio: Number,
        restaurante_id: mongoose.Types.ordenId,
        imgurl: String,
    }],
    ordenes: [{
                fecha: Date,
                usuarioId: String,
                metodoPago: String,
                deliveryType: String,
                deliveryId: mongoose.Types.ObjectId,
                estado: Number,
                Total: Number,
                detalles: [{
                    ordenId: mongoose.Types.ObjectId,
                    itemId: mongoose.Types.ObjectId,
                    cantidad: Number,    
                }],
    }],
});

module.exports = mongoose.model("Restaurantes", restauranteSchema);