"use strict";
const mongoose = require("mongoose");
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const users = [{
        name: "Arturo Moran",
        password: "Pass.word1",
        email: "amoran@test.com",
    },
    {
        name: "Juan Peres",
        password: "Pass.word1",
        email: "jperes@test.com",
    },
    {
        name: "Oscar Marin",
        password: "Pass.word1",
        email: "omarin@test.com",
    },

];

module.exports = function() {
    User.find()
        .count()
        .then(userCount => {
            if (userCount === 0) {
                const promises = users.map(u => {
                    const user = new User({
                        name: u.name,
                        email: u.email,
                        password: bcrypt.hashSync(u.password, 10)
                    });
                    return user.save();
                });
                return Promise.all(promises);
            } else {
                throw new Error("Can't populate DB, it's already populated");
            }
        })
        .then(users => {
            console.log("Users created");
        })
        .catch(err => {
            console.error(err.message);
        });
};