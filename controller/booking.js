const Listing=require("../Models/listing");
const Booking = require("../Models/booking");

module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut, guests } = req.body.booking;

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  // Basic validation
  if (checkInDate >= checkOutDate) {
    req.flash("error", "Check-out date must be after check-in date.");
    return res.redirect(`/listings/${id}`);
  }

  if (checkInDate < new Date().setHours(0, 0, 0, 0)) {
    req.flash("error", "Check-in date cannot be in the past.");
    return res.redirect(`/listings/${id}`);
  }

  // Availability check: does any existing confirmed booking overlap?
  const overlapping = await Booking.findOne({
    listing: id,
    status: "confirmed",
    checkIn: { $lt: checkOutDate },
    checkOut: { $gt: checkInDate },
  });

  if (overlapping) {
    req.flash("error", "This listing is already booked for the selected dates.");
    return res.redirect(`/listings/${id}`);
  }

  const listing = await Listing.findById(id);
  const totalNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  const totalPrice = totalNights * listing.price;

  const newBooking = new Booking({
    listing: id,
    user: req.user._id,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    guests,
    totalNights,
    totalPrice,
  });

  await newBooking.save();
  req.flash("success", "Booking confirmed!");
  res.redirect(`/listings/${id}`);
};

module.exports.myBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing")
    .sort({ checkIn: 1 });
  res.render("bookings/index", { bookings });
};

module.exports.cancelBooking = async (req, res) => {
  const { id, bookingId } = req.params;
  const booking = await Booking.findById(bookingId);

  if (!booking.user.equals(req.user._id)) {
    req.flash("error", "You are not authorized to cancel this booking.");
    return res.redirect(`/listings/${id}`);
  }

  booking.status = "cancelled";
  await booking.save();
  req.flash("success", "Booking cancelled.");
  res.redirect("/listings/" + id + "/bookings/my-bookings");
};