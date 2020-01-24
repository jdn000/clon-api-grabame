const express = require('express');
const router = express.Router();
const bandeja = require('../controllers/bandeja.controller');
const {
    verificaToken,
    verificaAdmin_rol
} = require('../middlewares/autenticacion');

router.post('/tray', [verificaToken], bandeja.createTray);
router.get('/tray/:id', [verificaToken, verificaAdmin_rol], bandeja.getTray);
router.delete('/tray/:id', [verificaToken, verificaAdmin_rol], bandeja.deleteTray);
router.get('/trays', [verificaToken, verificaAdmin_rol], bandeja.getTrays);
router.get('/trays/user/:rut', [verificaToken, verificaAdmin_rol], bandeja.getTraysByUser);
router.get('/trays/user/dates/:rut&:inicio&:termino', [verificaToken, verificaAdmin_rol], bandeja.getTraysByUserAndDateRange);
router.get('/trays/ubications', [verificaToken, verificaAdmin_rol], bandeja.getTraysByUbications);
router.get('/trays/type/:tipo', [verificaToken, verificaAdmin_rol], bandeja.getTraysByType);
router.get('/trays/dates/:fechaIngreso', [verificaToken, verificaAdmin_rol], bandeja.getTraysByDate);
router.get('/trays/date/:inicio&:termino', [verificaToken, verificaAdmin_rol], bandeja.getTraysByDateRange);
router.get('/trays/code/:codigoQr', [verificaToken, verificaAdmin_rol], bandeja.getTrayByQR);
router.get('/charts/monthly', [verificaToken, verificaAdmin_rol], bandeja.getCountByMonth);
router.get('/charts/yearly', [verificaToken, verificaAdmin_rol], bandeja.getCountByYear);
router.get('/charts/daily', [verificaToken, verificaAdmin_rol], bandeja.getCountByDay);

module.exports = router;