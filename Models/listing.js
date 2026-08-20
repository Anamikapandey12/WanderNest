const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    image: {
        url: {
            type: String,
            default: "",
        },
        filename: {
            type: String,
            default: "",
        },
    },

    price: {
        type: Number,
        required: true,
    },

    location: {
        type: String,
    },

    country: {
        type: String,
    },

    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.index({ geometry: "2dsphere" });

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;