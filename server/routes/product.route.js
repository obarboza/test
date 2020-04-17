const express = require('express');
const product = require('../models/product');
const autentication = require('../middlewares/autentication');


const app = express();
//find all products
app.get('/', (req, res, next) => {
    product.find({}, (err, products) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            products: products
        });

    });

});


//created or update product
app.post('/', autentication.verifytoken, (req, res) => {
    const products = req.body;
    const lstProducts = [];
    for (const prod of products) {
        if (prod._id) {
            //update
            product.findById(id, (err, productOld) => {

                productOld.description = prod.description;
                productOld.price = prod.price;
                productOld.amount = prod.amount;
                productOld.iva8 = prod.iva8;
                productOld.iva16 = prod.iva16;
                productOld.ieps = prod.ieps;

                productOld.save((err, prodcutSave) => {
                    lstProducts.push(prodcutSave)
                });
            });
        } else {
            const newProduct = new product({
                name: prod.name,
                description: prod.description,
                price: prod.price,
                amount: prod.amount,
                iva8: prod.iva8,
                iva16: prod.iva16,
                ieps: prod.ieps,
            });
            newProduct.save((err, prodcutSave) => {
                lstProducts.push(prodcutSave)
            });
        }
    }
    res.status(201).json({
        ok: true,
        products: lstProducts
    });
});

module.exports = app;