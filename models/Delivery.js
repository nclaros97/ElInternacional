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

  static async getAllOrders(user) {
    //1 para recoger 2 para delivery
    try {
      if (orden) {
        if (!user) {
          let filter = { deliveryType: "2", deliveryId: "", estado: 2 };
          let registro = await orden.find(filter);
          return registro.toArray();
        } else {
          let filter = { deliveryId: user };
          let registro = await orden.find(filter);
          return registro.toArray();
        }
      }
      return [];
    } catch (err) {
      console.log(err);
      return err;
    }
  }
  static async getOrderOne(id) {
    try {
      if (orden) {
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

  static async aceptarPedidoParaDelivery(id, user) {
    try {
      if (orden) {
        let filter = { _id: new ObjectId(id) };
        let update = {
          $set: { deliveryId: user },
        };
        const result = await orden.updateOne(filter, update);
        return result;
      }
      return [];
    } catch (err) {
      console.log(err);
      return err;
    }
  }
};
