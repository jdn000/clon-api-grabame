const express = require('express');
const router = express.Router();
const detalleBandeja = require('../controllers/detalleBandeja.controller');
const {
    verificaToken,
    verificaAdmin_rol
} = require('../middlewares/autenticacion');
router.post('/types', [verificaToken, verificaAdmin_rol], detalleBandeja.createDetails);
router.get('/types', [verificaToken, verificaAdmin_rol], detalleBandeja.getDetails);
router.put('/types/:tipo', [verificaToken, verificaAdmin_rol], detalleBandeja.updateDetails);
router.delete('/types/:tipo', [verificaToken, verificaAdmin_rol], detalleBandeja.deleteDetails);
module.exports = router;