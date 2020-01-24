const express = require('express')
const app = express()
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Sentry = require('@sentry/node');
Sentry.init({
    dsn: process.env.SENTRY
});
var cors = require('cors');
// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "allowedHeaders": "Content-Type,Authorization"
}))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

//habilitar index
app.use(express.static(path.resolve(__dirname, '../public'))); //agrega el archivo index.html ubicado en la carpeta public
app.use(require('./routes/index')); //añade las rutas a utilizar
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({
        silent: true
    });
}
mongoose.connect(process.env.MONGO_URI_DEV, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err, res) => {
    try {
        if (err) {
            console.log('No se puede conectar a la BBDD');
            throw err;
        } else {
            console.log('Conexión  establecida con la BBDD .');
        }
    } catch (error) {
        console.log(error)
    }
});

app.listen(process.env.PORT, () => console.log(`Bienvenido a Grabame REST Server -> http://localhost:${process.env.PORT}!`));
// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());