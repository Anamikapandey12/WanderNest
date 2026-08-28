const express = require("express");
const router = express.Router({mergeParams:true});
const mongoose = require("mongoose");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { reviewSchema } = require("../schema.js");
const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");
const {validateReview, isloggedIn}=require("../middleware.js")

const reviewController=require("../controller/review.js")

router.post("/",isloggedIn,
  validateReview,
  wrapAsync(reviewController.createReview))


// delete review
router.delete("/:reviewId", wrapAsync(reviewController.deleteReview));

module.exports = router;

