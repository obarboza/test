//requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

//body  parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// import routesS
var appRoute = require('./routes/route');
var appUser = require('./routes/user.route');
var appLogin = require('./routes/login.route');

//Conection
mongoose.connection.openUri('mongodb://localhost:27017/testdb', (err, res) => {
    if (err) throw err;
    console.log("conexion  exitosa");
});


//Routes
app.use('/user', appUser);
app.use('/login', appLogin);
app.use('/', appRoute);


// Escuchar petición
app.listen(3000, () => {
    console.log("Express server puerto 3000 online");
});