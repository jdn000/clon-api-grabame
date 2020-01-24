const Joi = require('joi');

let schemaUsuario = (req, res, next) => {
    const data = req.body;

    const schema = Joi.object().keys({

        email: Joi.string().email().regex(/[a-z0-9]+[_a-z0-9.-][a-z0-9]+@[a-z0-9-]+(.[a-z0-9-]+)(.[a-z]{2,4})/).required().error(new Error('Error en el ingreso del email')),
        nombre: Joi.string().min(4).max(25).required().error(new Error('Error en el ingreso del nombre')),
        apPat: Joi.string().min(4).max(25).required().error(new Error('Error en el ingreso del apPat')),
        apMat: Joi.string().min(4).max(25).required().error(new Error('Error en el ingreso del apMat')),
        telefono: Joi.string().regex(/^(\+?56)?(\s?)(0?9)(\s?)[987654]\d{7}$/).required().error(new Error('Error en el ingreso del telefono')),
        password: Joi.string().regex(/^[\x20-\x7E]+$/).min(6).max(72).required().error(new Error('Error en el ingreso del password')),
        rut: Joi.string().required().error(new Error('Error en el ingreso del rut')),
        activado: Joi.string().valid(true, false).default(true),
        sexo: Joi.string().valid('F', 'M').default('M').required().error(new Error('Error en el ingreso del sexo')),
        ubicacion: Joi.string().error(new Error('Error en el ingreso de la ubicacion'))

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

module.exports = {
    schemaUsuario
};