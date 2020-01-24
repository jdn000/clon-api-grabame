const express = require('express');
const router = express.Router();
const ubicacion = require('../controllers/ubicacion.controller');
const {
    verificaToken,
    verificaAdmin_rol
} = require('../middlewares/autenticacion');
const schemaUbicacion = require('../middlewares/ubicacionSchema');
router.post('/ubication', [verificaToken, verificaAdmin_rol, schemaUbicacion], ubicacion.createUbication);
router.get('/ubication', [verificaToken, verificaAdmin_rol], ubicacion.getUbications);
router.put('/ubication/update/:id', [verificaToken, verificaAdmin_rol], ubicacion.updateUbication);
router.delete('/ubication/:id', [verificaToken, verificaAdmin_rol], ubicacion.deleteUbication);
module.exports = router;