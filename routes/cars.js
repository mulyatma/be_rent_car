const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// Mendapatkan semua mobil dengan opsi pencarian dan filter
router.get('/', async (req, res) => {
    try {
        let query = {};

        // Pencarian berdasarkan nama mobil (jika ada)
        if (req.query.nameCar) {
            query.nameCar = { $regex: req.query.nameCar, $options: 'i' }; // i adalah case-insensitive
        }

        // Filter berdasarkan keberadaan sopir (jika ada)
        if (req.query.driver) {
            query.driver = req.query.driver === 'true'; // konversi string 'true' ke boolean true
        }

        const cars = await Car.find(query);
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mendapatkan mobil berdasarkan ID
router.get('/:id', getCar, (req, res) => {
    res.json(res.car);
});

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
