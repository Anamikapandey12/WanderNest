const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to get :id from listing route
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controller/booking");

router.post("/", isLoggedIn, wrapAsync(bookingController.createBooking));
router.get("/my-bookings", isLoggedIn, wrapAsync(bookingController.myBookings));
router.delete("/:bookingId", isLoggedIn, wrapAsync(bookingController.cancelBooking));

module.exports = router;