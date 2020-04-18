const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

// verification token
exports.verifytoken = function(req, res, next) {
    let token = '';
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    }
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