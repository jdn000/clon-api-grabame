const express = require('express');
const app = express();
app.use(require('./bandeja'));
app.use(require('./ubicacion'));
app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./detalleBandeja'));
module.exports = app;