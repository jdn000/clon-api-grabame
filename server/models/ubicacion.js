const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ubicacionSchema = new Schema({
    lugar: {
        type: String
    },
    ubicacionActiva: {
        type: Boolean,
        default: true
    }
});


module.exports = mongoose.model('Ubicacion', ubicacionSchema);