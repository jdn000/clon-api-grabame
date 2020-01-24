const express = require('express');
const router = express.Router();
const login = require('../controllers/login.controller');
const { sacaToken } = require('../middlewares/autenticacion');
router.post('/login',login.signIn);
router.post('/logout',[sacaToken],login.signOut);
module.exports = router;

