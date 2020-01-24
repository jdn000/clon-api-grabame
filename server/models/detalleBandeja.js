const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
let tiposDeBandejas = {
    values: ['A', 'B', 'C'],
    message: '{VALUE} no es un tipo de bandeja valido'
};
let detalleBandejaSchema = new Schema({
    tipo: {
        type: String,
        enum: tiposDeBandejas,
        unique: true
    },
    descripcion: {
        type: String
    }
});

detalleBandejaSchema.plugin(uniqueValidator, {
    message: ' ya existe una bandeja de tipo {PATH} en el sistema'
});
module.exports = mongoose.model('detalleBandeja', detalleBandejaSchema);