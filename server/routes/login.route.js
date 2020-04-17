var express = require('express');
var bcrypt = require('bcryptjs');
var user = require('../models/user');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;


var app = express();

//autentication
app.post('/', (req, res) => {
    var body = req.body;
    user.findOne({ email: body.email }, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!user || !bcrypt.compareSync(body.password, user.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas '
            });
        }
        //create JWT
        user.password = ''
        var token = jwt.sign({ user, user }, SEED, { expiresIn: 14400 });
        res.status(201).json({
            ok: true,
            user: user,
            id: user._id,
            token: token
        });

    });

});

module.exports = app;