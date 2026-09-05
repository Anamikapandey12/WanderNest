const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isloggedIn } = require("../middleware");
const bookingController = require("../controller/booking");

router.get("/my-bookings", isloggedIn, wrapAsync(bookingController.myBookings));

module.exports = router;