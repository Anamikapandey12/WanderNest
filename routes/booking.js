const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to get :id from listing route
const wrapAsync = require("../utils/wrapAsync");
const { isloggedIn } = require("../middleware");
const bookingController = require("../controller/booking");

router.post("/", isloggedIn, wrapAsync(bookingController.createBooking));
router.get("/my-bookings", isloggedIn, wrapAsync(bookingController.myBookings));
router.delete("/:bookingId", isloggedIn, wrapAsync(bookingController.cancelBooking));

module.exports = router;