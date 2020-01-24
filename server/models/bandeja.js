const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let bandejaSchema = new Schema({
    fechaIngreso: {
        type: Date,
        required: true,
    },
    idImg: {
        type: String,
        required: true,
    },
    codigoQr: {
        type: String,
        required: true,
    },
    tipoDeBandeja: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'detalleBandeja'
    },
    ubicacion: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Ubicacion'
    },
    usuario: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    }
});
module.exports = mongoose.model('Bandeja', bandejaSchema);