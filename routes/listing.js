const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../Models/listing.js");

const {
    isloggedin,
    isOwner,
    validateListing
} = require("../middleware.js");

const listingController = require("../controller/listing.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

console.log("Listing router loaded");

// ===============================
// ALL LISTINGS + CREATE LISTING
// ===============================
router
    .route("/")
    .get(
        wrapAsync(listingController.index)
    )
    .post(
        isloggedin,
        upload.single("image"),
        validateListing,
        wrapAsync(listingController.createListing)
    );

// ===============================
// NEW LISTING FORM
// ===============================
router.get(
    "/new",
    isloggedin,
    listingController.renderNewForm
);

router.get("/search",
   wrapAsync (listingController.search));

// ===============================
// SHOW / UPDATE / DELETE LISTING
// ===============================
router
    .route("/:id")
    .get(
        wrapAsync(listingController.showListing)
    )
    .put(
        isloggedin,
        isOwner,
        upload.single("image"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isloggedin,
        isOwner,
        wrapAsync(listingController.deleteListing)
    );

// ===============================
// EDIT LISTING FORM
// ===============================
router.get(
    "/:id/edit",
    isloggedin,
    isOwner,
    wrapAsync(listingController.editListing)
);

module.exports = router;