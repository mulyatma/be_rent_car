require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(bodyParser.json());

const carsRouter = require('./routes/cars');
const usersRouter = require('./routes/users');
const rentCarsRouter = require('./routes/rentCar');
app.use('/cars', carsRouter);
app.use('/users', usersRouter);
app.use('/rentcars', rentCarsRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
