const DetalleBandeja = require('../models/detalleBandeja');
const _ = require('underscore');
module.exports = {

    createDetails: async (req, res) => {
        try {
            let detalleBandeja = new DetalleBandeja({
                tipo: req.body.tipo,
                descripcion: req.body.descripcion
            });

            await detalleBandeja.save()

            res.send({
                success: true,
                detalleBandeja
            });

        } catch (error) {
            res.send({
                success: false,
                message: 'No fue posible guardar la informacion',
                error
            });
        }

    },
    getDetails: async (req, res) => {

        try {

            let detalleDB = await DetalleBandeja.find({})
                .exec();
            if (!detalleDB) {
                throw error
            }
            res.send({
                success: true,
                detalleDB

            });

        } catch (error) {
            res.send({
                success: false,
                error: {
                    message: 'No existe la información en la base de datos'
                }
            });
        }
    },
    updateDetails: async (req, res) => {
        let tipoBandeja = req.params.tipo;
        let body = _.pick(req.body, ['tipo', 'descripcion']);
        try {
            let detalleDB = await DetalleBandeja.findOneAndUpdate({
                tipo: tipoBandeja
            }, body)
            if (!detalleDB) {
                throw error;
            }
            return res.send({
                success: true,
                message: ' Detalles de Bandeja actualizada exitosamente',
                detalleDB
            });

        } catch (error) {
            return res.send({
                success: false,
                message: 'El tipo de bandeja no existe',
                error
            });
        }

    },
    deleteDetails: async (req, res) => {
        let tipo = req.params.tipo;
        try {
            await DetalleBandeja.findOneAndDelete(tipo);

            res.send({
                success: true,
                message: 'Tipo de bandeja eliminada exitosamente'
            });
        } catch (error) {
            return res.send({
                success: false,
                message: 'El tipo de bandeja ingresado no existe',
                err
            });
        }

    }
};