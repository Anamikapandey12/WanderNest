const Listing = require("../Models/listing");

// ===============================
// INDEX - SHOW ALL LISTINGS
// ===============================
module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index", { allListing });
};


// ===============================
// NEW LISTING FORM
// ===============================
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


// ===============================
// SHOW LISTING
// ===============================
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash(
            "error",
            "Listing you requested does not exist"
        );

        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};


// ===============================
// CREATE LISTING
// ===============================
module.exports.createListing = async (req, res) => {

    // ===============================
    // CLOUDINARY IMAGE
    // ===============================
    const url = req.file ? req.file.path : "";
const filename = req.file ? req.file.filename : "";

    console.log("Image URL:", url);
    console.log("Image filename:", filename);


    // ===============================
    // CREATE LISTING
    // ===============================
    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;

    newListing.image = {
        url,
        filename
    };


    // ===============================
    // OPENSTREETMAP GEOCODING
    // ===============================

    const location = req.body.listing.location;
    const country = req.body.listing.country;

    const searchLocation = `${location}, ${country}`;

    try {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q=${encodeURIComponent(searchLocation)}`,
            {
                headers: {
                    "User-Agent": "Wanderlust-College-Project/1.0"
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                `Nominatim API error: ${response.status}`
            );
        }

        const data = await response.json();

        console.log("Geocoding result:", data);


        // ===============================
        // LOCATION FOUND
        // ===============================

        if (data.length > 0) {

            const latitude = Number(data[0].lat);
            const longitude = Number(data[0].lon);

            newListing.geometry = {
                type: "Point",
                coordinates: [
                    longitude,
                    latitude
                ]
            };

        } else {

            // Location not found
            req.flash(
                "error",
                `Could not find the location "${searchLocation}". Please enter a valid location.`
            );

            return res.redirect("/listings/new");
        }


    } catch (error) {

        console.error("Geocoding error:", error);

        req.flash(
            "error",
            "Unable to find the location right now. Please try again."
        );

        return res.redirect("/listings/new");
    }


    // ===============================
    // SAVE LISTING
    // ===============================
    await newListing.save();

    req.flash(
        "success",
        "New Listing Created"
    );

    res.redirect("/listings");
};


// ===============================
// EDIT LISTING
// ===============================
module.exports.editListing = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash(
            "error",
            "Listing you requested does not exist"
        );

        return res.redirect("/listings");
    }

    let originaImageUrl = listing.image.url;

    originaImageUrl = originaImageUrl.replace(
        "/upload",
        "/upload/w_250"
    );

    res.render("listings/edit.ejs", {
        listing,
        originaImageUrl
    });
};


// ===============================
// UPDATE LISTING
// ===============================
module.exports.updateListing = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true }
    );

    if (!listing) {
        req.flash(
            "error",
            "Listing you requested does not exist"
        );

        return res.redirect("/listings");
    }


    // ===============================
    // UPDATE IMAGE
    // ===============================

    if (req.file) {

        const url = req.file.path;
        const filename = req.file.filename;

        listing.image = {
            url,
            filename
        };
    }


    // ===============================
    // UPDATE LOCATION
    // ========
    // =======================

    const location = req.body.listing.location;
    const country = req.body.listing.country;

    const searchLocation = `${location}, ${country}`;

    try {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q=${encodeURIComponent(searchLocation)}`,
            {
                headers: {
                    "User-Agent": "Wanderlust-College-Project/1.0"
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                `Nominatim API error: ${response.status}`
            );
        }

        const data = await response.json();

        if (data.length > 0) {

            const latitude = Number(data[0].lat);
            const longitude = Number(data[0].lon);

            listing.geometry = {
                type: "Point",
                coordinates: [
                    longitude,
                    latitude
                ]
            };
        }

    } catch (error) {

        console.error(
            "Geocoding update error:",
            error
        );
    }


    await listing.save();

    req.flash(
        "success",
        "Listing Updated"
    );

    res.redirect(`/listings/${id}`);
};


// ===============================
// DELETE LISTING
// ===============================
module.exports.deleteListing = async (req, res) => {

    const { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash(
        "success",
        "Listing Deleted"
    );

    res.redirect("/listings");
};
module.exports.search = async (req, res) => {
    const { city } = req.query;

    if (!city || city.trim() === "") {
        return res.redirect("/listings");
    }

    const searchCity = city.trim();

    const allListing = await Listing.find({
        $or: [
            {
                location: {
                    $regex: searchCity,
                    $options: "i"
                }
            },
            {
                country: {
                    $regex: searchCity,
                    $options: "i"
                }
            }
        ]
    });

    if (allListing.length === 0) {
        req.flash(
            "error",
            `No listings found for "${searchCity}".`
        );
        return res.redirect("/listings");
    }

    res.render("listings/index", { allListing });
};