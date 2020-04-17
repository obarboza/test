const express = require('express');
const bcrypt = require('bcryptjs');
const user = require('../models/user');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;


const app = express();

//autentication
app.post('/', (req, res) => {
    const body = req.body;
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
        const token = jwt.sign({ user, user }, SEED, { expiresIn: 14400 });
        res.status(201).json({
            ok: true,
            user: user,
            id: user._id,
            token: token
        });

    });

});

module.exports = app;