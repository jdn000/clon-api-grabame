const Joi = require('joi');

let ubicacionSchema = (req, res, next) => {
    const data = req.body;

    const schema = Joi.object().keys({

        lugar: Joi.string().min(4).max(40).required().error(new Error('Error en el ingreso de la ubicacion')),
        ubicacionActiva: Joi.string().valid(true, false).default(true).error(new Error('Error en el ingreso de la ubicacion activa/inactiva')),
    });

    Joi.validate(data, schema, (err, value) => {

        if (err) {
            res.send({
                success: false,
                message: err.message
            });

        } else {

            next();
        }

    });
}
module.exports = ubicacionSchema;