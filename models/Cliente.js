// Primero obtenemos la clase de la base de datos. (Singleton)
const db = require("../../dao/db");
const e = require("express");
const { use } = require("passport");
const ObjectId = require("mongodb").ObjectId;

//variable que contendran punteros hacia las colecciones
let restaurantes;
let itemsRestaurantes;
let carrito;
let orden;
let detalleOrden;
// NOTA: LOS MODELOS DE DATOS SON CLASES QUE CONTIENEN SOLAMENTE METODOS ESTÁTICOS
module.exports = class {
  // initModel
  static async initModel() {
    if (
      !restaurantes ||
      !itemsRestaurantes ||
      !carrito ||
      !orden ||
      !detalleOrden
    ) {
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

      if (!carrito) {
        //console.log(_db);
        carrito = await _db.collection("carrito");
        console.log("Coleccion de carritos asignados");
      }

      if (!orden) {
        //console.log(_db);
        orden = await _db.collection("orden");
        console.log("Coleccion de ordenes asignados");
      }

      if (!detalleOrden) {
        //console.log(_db);
        detalleOrden = await _db.collection("detalleOrden");
        console.log("Coleccion de detalle de orden asignados");
      }

      return;
    } else {
      return;
    }
  }

  static async getAllOrders(user) {
    try {
      if (restaurantes) {
        let filter = { usuarioId: user };
        let registro = await orden.find(filter);
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

  static async getAllCarrito(user) {
    try {
      if (restaurantes) {
        let filter = { userid: user };
        let registro = await carrito.find(filter);
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

  static async addNewOrder(user, data) {
    try {
      //verificar que sea usuario para restaurantes
      //obtener id de usuario ya validadar

      let totalOrden = 0;

      let filter = { userid: user };
      const dataCarrito = await carrito.find(filter).toArray();
      let idRes = "";
      for (let index = 0; index < dataCarrito.length; index++) {
        const element = dataCarrito[index];
        let filter = { _id: ObjectId(dataCarrito[index].itemId) };

        var item = await itemsRestaurantes.findOne(filter);
        totalOrden += dataCarrito[index].cantidad * item.precio;
        console.log(dataCarrito[index].cantidad + "*" + item.precio);
      }
      const newOrder = {
        fecha: new Date().getTime(),
        usuarioId: user,
        metodoPago: data.metodoPago,
        deliveryType: data.deliveryType,
        deliveryId: "",
        estado: 1,
        Total: totalOrden,
      };
      const result = await orden.insertOne(newOrder);
      console.log(result.insertedId);
      console.log("ORDEN CREADA");
      dataCarrito.forEach(async (dataCarrito) => {
        var addDetalle = {
          ordenId: result.insertedId,
          itemId: dataCarrito.itemId,
          cantidad: dataCarrito.cantidad,
        };
        detalleOrden.insertOne(addDetalle);
        console.log("DETALLE AGREGADO");

        carrito.deleteOne({ _id: ObjectId(dataCarrito._id) });
        console.log("ITEM DEL CARRITO ELIMINADO");
      });

      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async addNewItem(id, user) {
    try {
      let filter = { itemId: id, userid: user };
      var cantDb = await carrito.findOne(filter);
      if (!cantDb) {
        const newItemCarrito = {
          userid: user,
          itemId: id,
          cantidad: 1,
          fechaIngreso: new Date().getTime(),
          lastUpdate: new Date().getTime(),
        };
        const result = await carrito.insertOne(newItemCarrito);
        return result;
      } else {
        let filterw = { _id: new ObjectId(cantDb._id) };
        let updatew = {
          $inc: { cantidad: 1 },
          $set: { lastUpdate: new Date().getTime() },
        };
        const result = await carrito.updateOne(filterw, updatew);
        return result;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async delItemCarrito(id, user) {
    try {
      let filter = { itemId: id };
      var cantDb = await carrito.findOne(filter);
      console.log(cantDb);
      if (cantDb.cantidad == 1) {
        let filter = { _id: new ObjectId(cantDb._id) };
        const result = await carrito.deleteOne(filter);
        return result;
      } else {
        let filterw = { _id: new ObjectId(cantDb._id) };
        let updatew = {
          $inc: { cantidad: -1 },
          $set: { lastUpdate: new Date().getTime() },
        };
        const result = await carrito.updateOne(filterw, updatew);
        return result;
      }
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

  static async getItem(id, idRes) {
    try {
      console.log(id);
      console.log(idRes);
      let filter = { restaurante_id: idRes, _id: ObjectId(id) };
      let registro = await itemsRestaurantes.find(filter);

      return registro.toArray();
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
