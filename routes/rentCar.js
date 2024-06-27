const express = require('express');
const router = express.Router();
const RentCar = require('../models/RentCar');
const Car = require('../models/Car');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware untuk mengautentikasi token
function authenticateToken(req, res, next) {
    const authHeader = req.headers.token;
    const token = authHeader
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Menyewa mobil
router.post('/', authenticateToken, async (req, res) => {
    const { carId, startDate, endDate } = req.body;
    try {
        // Cek apakah mobil tersedia
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Hitung total harga berdasarkan lama sewa (contoh sederhana: per hari)
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalPrice = days * car.price;

        // Buat data penyewaan mobil baru
        const rentCar = new RentCar({
            carId: carId,
            userId: req.user.id, // Dapatkan ID pengguna dari token
            startDate: start,
            endDate: end,
            totalPrice: totalPrice
        });

        // Simpan penyewaan dan tandai mobil sebagai tidak tersedia
        await rentCar.save();
        car.available = false;
        await car.save();

        res.status(201).json(rentCar);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Melihat riwayat penyewaan mobil berdasarkan userId
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const rentCars = await RentCar.find({ userId: req.user.id }).populate('carId');
        res.json(rentCars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
