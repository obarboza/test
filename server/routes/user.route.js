var express = require('express');
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var autentication = require('../middlewares/autentication');


var app = express();
//find Users
app.get('/', (req, res, next) => {
    User.find({}, (err, users) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            users: users
        });

    });

});


//update user
app.put('/:id', autentication.verifytoken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, userOld) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!userOld) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuarion no existe'
            });
        }
        userOld.name = body.name;
        userOld.email = body.email;

        userOld.save((err, usersave) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                });
            }
            res.status(201).json({
                ok: true,
                user: usersave
            });
        });

    });

});

//created User
app.post('/', autentication.verifytoken, (req, res) => {
    var body = req.body;
    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10)
    });
    user.save((err, usersave) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            user: usersave,
            userToken: req.userToken
        });
    });

});



module.exports = app;