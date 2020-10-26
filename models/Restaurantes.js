// Primero obtenemos la clase de la base de datos. (Singleton)
const db = require("../../dao/db");
const e = require("express");
const ObjectId = require("mongodb").ObjectId;

//variable que contendran punteros hacia las colecciones
let restaurantes;
let itemsRestaurantes;
let orden;
// NOTA: LOS MODELOS DE DATOS SON CLASES QUE CONTIENEN SOLAMENTE METODOS ESTÁTICOS
module.exports = class {
  // initModel
  static async initModel() {
    if (!restaurantes || !itemsRestaurantes || !orden) {
      let _db = await db.getDB();
      if (!restaurantes) {
        //console.log(_db);
        restaurantes = await _db.collection("restaurantes");
        console.log("Coleccion de Restaurantes asignados");
      }
      if (!itemsRestaurantes) {
        //console.log(_db);
        itemsRestaurantes = await _db.collection("itemsrestaurantes");
        console.log("Coleccion de Items de Restaurantes asignados");
      }
      if (!orden) {
        //console.log(_db);
        orden = await _db.collection("orden");
        console.log("Coleccion de ordenes asignados");
      }
      return;
    } else {
      return;
    }
  }

  //
  static async getAll() {
    try {
      if (restaurantes) {
        let registro = await restaurantes.find();
        return registro.toArray();
      }
      return [];
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async getAllOrders() {
    try {
      if (restaurantes) {
        let registro = await orden.find();
        return registro.toArray();
      }
      return [];
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async getOrderOne(id) {
    try {
      if (restaurantes) {
        let filter = { _id: ObjectId(id) };
        let registro = await orden.find(filter);
        return registro.toArray();
      }
      return [];
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async getAllOwn(id) {
    try {
      if (restaurantes) {
        console.log(id);
        let filter = { userId: id };
        let registro = await restaurantes.find(filter);
        return registro.toArray();
      }
      return [];
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async getAllItems(id) {
    try {
      let filter = { restaurante_id: id };
      let registro = await itemsRestaurantes.find(filter);

      return registro.toArray();
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async addnew(data, urlimg, user) {
    try {
      //verificar que sea usuario para restaurantes
      //obtener id de usuario ya validadar
      const newRestaurante = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        rating: data.rating,
        aprox_delivery_time: data.aprox_delivery_time,
        direccion: data.direccion,
        latitud: data.latitud,
        longitud: data.longitud,
        cargo_empaque: data.cargo_empaque,
        delivery_tipe: data.delivery_tipe,
        delivery_radio: data.delivery_radio,
        costo_repartir: data.costo_repartir,
        precio_minimo_orden: data.precio_minimo_orden,
        imagen_url: urlimg,
        userId: user,
      };
      const result = await restaurantes.insertOne(newRestaurante);
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async addNewItem(data, urlimg, id) {
    try {
      const newItemRestaurante = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        restaurante_id: id,
        imgurl: urlimg,
      };
      const result = await itemsRestaurantes.insertOne(newItemRestaurante);
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async ChangeStatus(id, status) {
    try {
      let filter = { _id: new ObjectId(id) };
      var est = 1;
      switch (status) {
        case "aceptar":
          est = 2;
          break;
        case "listo":
          est = 3;
          break;
        case "recogido":
          est = 4;
          break;
        case "entregado":
          est = 5;
          break;
        case "cancelado":
          est = 6;
          break;
      }

      let update = {
        $set: { estado: est },
      };
      const result = await orden.updateOne(filter, update);
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async getOne(id) {
    try {
      let filter = { _id: new ObjectId(id) };
      const result = await restaurantes.findOne(filter);
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async updateItem(id, data, idres, urlimg) {
    try {
      let filter = { _id: new ObjectId(id) };

      let d = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        restaurante_id: idres,
        imgurl: urlimg,
      };

      let update = {
        $set: d,
      };
      const result = await itemsRestaurantes.updateOne(filter, update);
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async deleteOne(id) {
    try {
      let filter = { _id: new ObjectId(id) };
      const result = await itemsRestaurantes.deleteOne(filter);
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
};
