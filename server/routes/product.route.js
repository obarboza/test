const express = require('express');
const product = require('../models/product');
const autentication = require('../middlewares/autentication');
const excelToJson = require('convert-excel-to-json');
const multer = require('multer');
const upload = multer();


const app = express();
//find all products
app.get('/', autentication.verifytoken, (req, res, next) => {
    product.find({}, (err, products) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscar los productos',
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
app.post('/', autentication.verifytoken, upload.single('fileKey'), async(req, res) => {
    const formData = req.file;
    const products = [];
    const result = excelToJson({
        source: formData.buffer,
        columnToKey: {
            A: 'name',
            B: 'description',
            C: 'price',
            D: 'amount',
            E: 'iva8',
            F: 'iva16',
            G: 'ieps',
        }
    });
    result.Sheet1.shift();
    for (const prod of result.Sheet1) {
        await product.findOne({ name: prod.name }, async(err, productOld) => {
            if (productOld) {
                productOld.description = prod.description;
                productOld.price = prod.price;
                productOld.amount = prod.amount;
                productOld.iva8 = prod.iva8;
                productOld.iva16 = prod.iva16;
                productOld.ieps = prod.ieps;

                await productOld.save((err, prodcutSave) => {
                    products.push(prodcutSave);
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
                await newProduct.save((err, prodcutSave) => {
                    products.push(prodcutSave);
                });
            }
        });
    }
    res.status(201).json({
        ok: true,
        products: products
    });
});

module.exports = app;