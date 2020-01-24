const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};
let sexosValidos = {
    values: ['M', 'F'],
    message: '{VALUE} no es un sexo valido'
};
let usuarioSchema = new Schema({
    nombre: {
        type: String,

    },   apPat: {
        type: String,

    },
    apMat: {
        type: String,

    },
    email: {
        type: String,
        unique: true,
    },
    telefono: {
        type: Number,
    },
    password: {
        type: String,
    },
    rol: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    activado: {
        type: Boolean,
        default: true
    },
    rut: {
        type: String,
        unique: true,

    },
    sexo: {
        type: String,
        default: 'M',
        enum:sexosValidos
    },
    ubicacion: {
        type: Schema.Types.ObjectId,
        ref: 'Ubicacion'
    }
});
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
module.exports = mongoose.model('Usuario', usuarioSchema);