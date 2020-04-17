//requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Inicializar variables
const app = express();

//body  parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// import routes
const appRoute = require('./routes/route');
const appUser = require('./routes/user.route');
const appLogin = require('./routes/login.route');
const appProduct = require('./routes/product.route');

//Conection
mongoose.connection.openUri('mongodb://localhost:27017/testdb', (err, res) => {
    if (err) throw err;
    console.log("conexion  exitosa");
});


//Routes
app.use('/user', appUser);
app.use('/login', appLogin);
app.use('/product', appProduct);
app.use('/', appRoute);


// Escuchar petición
app.listen(3000, () => {
    console.log("Express server puerto 3000 online");
});