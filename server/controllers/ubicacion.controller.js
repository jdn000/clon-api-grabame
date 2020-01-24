const Ubicacion = require('../models/ubicacion');
const _ = require('underscore');
module.exports = {

    createUbication: async (req, res) => {

        try {
            let ubicacion = new Ubicacion({
                lugar: req.body.lugar
            });

            let ubicacionDB = await ubicacion.save()

            res.send({
                success: true,
                ubicacion: ubicacionDB
            });


        } catch (error) {
            return res.send({
                success: false,
                message: 'No se pudo crear una ubicación',
                error
            });

        }

    },
    getUbications: async (req, res) => { //obtiene todas las ubicaciones registradas en BBDD
        try {

            let ubicaciones = await Ubicacion.find({})
                .where({
                    ubicacionActiva: true
                })
                .exec()

            if (!ubicaciones.length) {
                res.send({
                    success: true,
                    message: 'No existen ubicaciones en la base de datos',
                    error
                });
            } else {

                res.send({
                    success: true,
                    ubicaciones
                });
            }


        } catch (error) {
            return res.send({
                success: false,
                message: 'No existen ubicaciones en la base de datos',
                error
            });

        }
    },
    updateUbication: async (req, res) => {
        let id = req.params.id;
        let body = _.pick(req.body, ['lugar', 'ubicacionActiva']);
        try {
            let ubicacionDB = await Ubicacion.findByIdAndUpdate(id, body)

            res.send({
                success: true,
                message: 'Ubicacion actualizada exitosamente',
                body
            });

        } catch (error) {
            return res.send({
                success: false,
                message: 'No fue posible actualizar la ubicación',
                error
            });
        }

    },
    deleteUbication: async (req, res) => {
        let id = req.params.id;
        let cambiaEstado = {
            ubicacionActiva: false
        };
        try {
            let ubicacionDB = await Ubicacion.findByIdAndUpdate(id, cambiaEstado)
            if (!ubicacionDB) {
                return res.send({
                    success: false,
                    error,
                    message: 'La ubicacion no existe'

                });
            }
            res.send({
                success: true,
                message: 'Ubicacion eliminada exitosamente'
            });

        } catch (error) {
            return res.send({
                success: false,
                message: 'No fue posible actualizar la ubicación',
                error
            });
        }
    }
};