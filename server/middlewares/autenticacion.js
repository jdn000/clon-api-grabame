const jwt = require('jsonwebtoken');
const {
    validate,
    clean,
    format
} = require('rut.js');

let verificaToken = (req, res, next) => {
    let authorization = req.get('authorization');
    jwt.verify(authorization, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Token no válido',
                err
            });
        } else {
            req.usuario = decoded.usuario;
            next();
        }
    });
};
let sacaToken = (req, res, next) => {
    req.headers.authorization = '*_*';
    next();
};
//verificacion de rol
let verificaAdmin_rol = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.rol === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(403).send({
            success: false,
            message: 'No es posible el acceso',
            err
        });
    };
};
let verificaDatosUsuario = (req, res, next) => {
    let body = req.body;
    if (validate(body.rut)) {
        next();
    } else {
        if (!validate(body.rut)) {
            return res.send({
                success: false,
                message: 'Rut inválido'
            });
        }
    }
};
module.exports = {
    verificaToken,
    verificaAdmin_rol,
    sacaToken,
    verificaDatosUsuario
}