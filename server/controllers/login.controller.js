const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
module.exports = {

    signIn: async (req, res) => {
        let body = req.body;
        try {

            let usuarioDB = await Usuario.findOne({
                    rut: body.rut
                })
                .populate('ubicacion')
                .exec()
            if (!usuarioDB) {
                throw error;
            }
            if (usuarioDB.activado === false) {
                throw error
            }
            if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
                return res.status(503).send({
                    success: true,
                    message: 'Error, Usuario o contraseña incorrectos'
                });
            }
            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED, {
                expiresIn: process.env.CADUCIDAD_TOKEN
            });
            return res.send({
                success: true,
                message: 'Ingresaste exitosamente',
                token,
                usuario: usuarioDB._id,
                nombreUsuario: usuarioDB.nombre,
                apellidoPaternoUsuario: usuarioDB.apPat,
                apellidoMaternoUsuario: usuarioDB.apMat,
                rut: usuarioDB.rut,
                ubicacion: usuarioDB.ubicacion
            });

        } catch (error) {
            return res.send({
                success: false,
                message: 'Error de ingreso',
                error
            });

        }



    },
    signOut: (req, res) => {
        return res.status(200).send({
            success: true,
            message: 'Saliste exitosamente',
        });
    }
};