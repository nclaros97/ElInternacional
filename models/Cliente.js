// Importar los módulos requeridos
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const carritoShemaShema = new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    itemId: mongoose.Types.ObjectId,
    cantidad: Number,
    fechaIngreso: Date,
    lastUpdate: Date,
});

module.exports = mongoose.model("Clientes", carritoShemaShema);