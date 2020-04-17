const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product = new Schema({
    name: { type: String, unique: true, required: [true, 'El nombre es necesario'] },
    description: { type: String, required: [true, 'La descrpción es necesaria'] },
    price: { type: Number, required: [true, 'El precío es necesario'] },
    amount: { type: Number, required: [true, 'La cantidad es necesaria'] },
    iva8: { type: Boolean, default: 0 },
    iva16: { type: Boolean, default: 0 },
    ieps: { type: Boolean, default: 0 }

});


module.exports = mongoose.model('product', product);