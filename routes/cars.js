const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// Mendapatkan semua mobil
router.get('/', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mendapatkan mobil berdasarkan ID
router.get('/:id', getCar, (req, res) => {
    res.json(res.car);
});

// Mendapatkan semua mobil berdasarkan status driver
// router.get('/driver/:driver', async (req, res) => {
//     try {
//         const cars = await Car.find({ driver: req.params.driver === 'true' });
//         res.json(cars);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// Middleware untuk mendapatkan mobil berdasarkan ID
async function getCar(req, res, next) {
    let car;
    try {
        car = await Car.findById(req.params.id);
        if (car == null) {
            return res.status(404).json({ message: 'Cannot find car' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.car = car;
    next();
}

module.exports = router;
