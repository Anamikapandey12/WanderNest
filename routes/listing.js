const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { listingSchema } = require("../schema.js");

const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");

// validation
const validateListing = (req, res, next) => {
let { error } = listingSchema.validate(req.body);
if (error) {
let errMsg = error.details.map((el) => el.message).join(",");
throw new ExpressError(400, errMsg);
} else {
next();
}
};

// index route
router.get("/", wrapAsync(async (req, res) => {
const allListing = await Listing.find({});
res.render("listings/index", { allListing });
}));

// new route
router.get("/new", (req, res) => {
res.render("listings/new.ejs");
});

// show route
router.get("/:id", wrapAsync(async (req, res, next) => {
let { id } = req.params;

if (!mongoose.Types.ObjectId.isValid(id)) {
return next(new ExpressError(404, "Listing not found"));
}

const listing = await Listing.findById(id).populate("reviews");

if (!listing) {
return next(new ExpressError(404, "Listing not found"));
}

res.render("listings/show.ejs", { listing });
}));

// create route
router.post("/", validateListing, wrapAsync(async (req, res) => {
const newListing = new Listing(req.body.listing);
await newListing.save();
res.redirect("/listings");
}));

// edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
let { id } = req.params;
const listing = await Listing.findById(id);
res.render("listings/edit.ejs", { listing });
}));

// update route
router.put("/:id", wrapAsync(async (req, res) => {
let { id } = req.params;
await Listing.findByIdAndUpdate(id, { ...req.body.listing });
res.redirect(`/listings/${id}`);
}));

// delete listing
router.delete("/:id", wrapAsync(async (req, res) => {
let { id } = req.params;
await Listing.findByIdAndDelete(id);
res.redirect("/listings");
}));



module.exports = router;
