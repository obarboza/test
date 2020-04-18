const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

//Google
const CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


const app = express();

//autentication
app.post('/', (req, res) => {
    const body = req.body;
    User.findOne({ email: body.username }, (err, user) => {
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
        const token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 });
        res.status(201).json({
            ok: true,
            user: user,
            id: user._id,
            token: token
        });

    });

});

// autenticacion google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        name: payload.name,
        email: payload.email,
    }
}

app.post('/google', async(req, res) => {

    let token = req.body.token;
    var googleUser = await verify(token).catch(e => {
        return res.status(400).json({
            ok: false,
            mensaje: 'token no valido '
        });
    });

    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (userDB) {
            userDB.password = ':)';
            const token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 });
            res.status(202).json({
                ok: true,
                user: userDB,
                id: userDB._id,
                token: token
            });
        } else {
            const user = new User({
                name: googleUser.name,
                email: googleUser.email,
                password: ':)'
            });
            user.save((err, usernew) => {
                const token = jwt.sign({ user: usernew }, SEED, { expiresIn: 14400 });
                res.status(201).json({
                    ok: true,
                    user: usernew,
                    id: user._id,
                    token: token
                });

            });
        }
    });
});

module.exports = app;