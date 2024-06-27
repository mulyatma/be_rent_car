const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    nameCar: { type: String, required: true },
    img: { type: String, required: true },
    passenger: { type: Number, required: true },
    oil: { type: String, required: true },
    transmission: { type: String, required: true },
    about: { type: String, required: true },
    price: { type: Number, required: true },
    driver: { type: Boolean, default: false }
});

module.exports = mongoose.model('Car', carSchema);
