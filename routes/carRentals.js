const express = require('express');
const {getCarRentals,getCarRental,createCarRental,updateCarRental,deleteCarRental} = require('../controllers/carRentals');
const router = express.Router();
const {protect,authorize} = require('../middleware/auth');
const rentsRouter = require('./rents');

router.route('/:carRentalId/rents',rentsRouter);
router.route('/')
    .get(getCarRentals)
    .post(protect,authorize('admin'),createCarRental);
router.route('/:id')
    .get(getCarRental)
    .put(protect,authorize('admin'),updateCarRental)
    .delete(protect,authorize('admin'),deleteCarRental);
module.exports = router;