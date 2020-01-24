const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const Usuario = require("../models/usuario");
const {
  clean,
  validate
} = require("rut.js");
module.exports = {
  createUser: async (req, res) => {
    let body = req.body;
    let run = clean(body.rut);
    try {
      let usuario = new Usuario({
        nombre: body.nombre.toLowerCase(),
        apPat: body.apPat.toLowerCase(),
        apMat: body.apMat.toLowerCase(),
        rut: run.toLowerCase(),
        email: body.email.toLowerCase(),
        telefono: body.telefono,
        password: bcrypt.hashSync(body.password, 11),
        rol: body.rol,
        sexo: body.sexo,
        activado: body.activado,
        ubicacion: body.ubicacion
      });
      let usuarioDB = await usuario.save();

      return res.send({
        success: true,
        message: "Guardado con éxito",
        usuario: {
          nombre: usuarioDB.nombre,
          apellidos: usuarioDB.apPat + ' ' + usuarioDB.apMat
        }
      });

    } catch (error) {
      return res.send({
        success: false,
        message: "No se pudo guardar",
        error
      });
    }

  },
  updateUser: async (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'apPat', 'apMat', 'rut', 'sexo', 'telefono', 'activado', 'email', 'rol', 'ubicacion', 'password']);
    try {
      let usuarioDB = await Usuario.findByIdAndUpdate(id, body, {
        new: true
      });

      return res.send({
        success: true,
        message: "Usuario actualizado con exito",
        usuarioDB
      });
    } catch (error) {
      return res.send({
        success: false,
        message: 'No fue posible actualizar',
        error
      });
    }
  },
  getUserByRut: async (req, res) => {
    let rut = req.params.rut;
    let run = clean(rut);
    try {

      let usuarioEncontrado = await Usuario.find({
            rut: run
          },
          "nombre apPat apMat rut sexo telefono activado rol ubicacion"
        )
        .where({
          activado: true
        })
        .populate("ubicacion")
        .exec()
      if (!usuarioEncontrado.length) {
        throw error;
      }
      return res.send({
        success: true,
        usuarioEncontrado
      });
    } catch (error) {

      return res.send({
        success: false,
        message: "No existe el usuario",
        error
      });
    }
  },
  getUserByName: async (req, res) => {
    let nombre = req.params.nombre.toLowerCase();
    let apPat = req.params.apPat.toLowerCase();
    let apMat = req.params.apMat.toLowerCase();
    try {

      let usuarioEncontrado = await Usuario.find({
            nombre: nombre,
            apPat: apPat,
            apMat: apMat
          },
          "nombre apPat apMat rut sexo telefono activado rol ubicacion"
        )
        .where({
          activado: true
        })
        .exec()
      if (!usuarioEncontrado.length) {
        throw error;
      }
      return res.send({
        success: true,
        usuarioEncontrado
      });
    } catch (error) {
      return res.send({
        success: false,
        message: "No existe el usuario",
        error
      });
    }
  },
  getUsers: async (req, res) => {

    try {
      let usuarios = await Usuario.find({},
          "nombre apPat apMat rut sexo telefono activado rol ubicacion"
        )
        .where({
          activado: true
        })
        .exec()
      if (!usuarios.length) {
        throw error;
      }
      return res.send({
        success: true,
        usuarios
      });
    } catch (error) {
      return res.send({
        success: false,
        message: "No existen usuarios",
        error
      });
    }

  },
  getDeletedUsers: async (req, res) => {
    try {
      let usuarios = await Usuario.find({},
          "nombre apPat apMat rut sexo telefono activado rol ubicacion"
        )
        .where({
          activado: false
        })
        .exec()
      if (!usuarios.length) {
        throw error;
      }
      return res.send({
        success: true,
        usuarios
      });
    } catch (error) {
      return res.send({
        success: false,
        message: "No existen usuarios",
        error
      });
    }
  },
  deleteUser: async (req, res) => {
    let rut = req.params.rut;
    let run = clean(rut);
    let cambiaEstado = {
      activado: false
    };
    try {
      let usuarioBorrado = await Usuario.findOneAndUpdate({
        rut: run
      }, cambiaEstado)
      if (!usuarioBorrado) {
        throw error
      }
      return res.send({
        success: true,
        message: "usuario eliminado con exito"
      });
    } catch (error) {
      res.send({
        success: false,
        message: "Usuario no encontrado",
        error
      });
    }
  }
};