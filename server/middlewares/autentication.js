const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

// verification token
exports.verifytoken = function(req, res, next) {

    const token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token Incorrecto',
                errors: err
            });
        }
        req.userToken = decoded.user;
        next();

    });
}