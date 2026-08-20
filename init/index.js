const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/listing.js");
const { object } = require("joi");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Simple delay helper to respect Nominatim's ~1 req/sec rate limit
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const geocodeLocation = async (location, country) => {
  const searchLocation = `${location}, ${country}`;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(searchLocation)}`,
      {
        headers: {
          "User-Agent": "Wanderlust-College-Project/1.0"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.length > 0) {
      return {
        type: "Point",
        coordinates: [Number(data[0].lon), Number(data[0].lat)]
      };
    } else {
      console.log(`No coordinates found for: ${searchLocation}`);
      return null;
    }
  } catch (error) {
    console.error(`Geocoding failed for ${searchLocation}:`, error.message);
    return null;
  }
};

const initDb = async () => {
  await Listing.deleteMany({});

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6a101610285f8a128984b2a7"
  }));

  for (let i = 0; i < initData.data.length; i++) {
    const listing = initData.data[i];
    const geometry = await geocodeLocation(listing.location, listing.country);

    if (geometry) {
      listing.geometry = geometry;
    }

    console.log(`Geocoded ${i + 1}/${initData.data.length}: ${listing.location}, ${listing.country}`);

    await sleep(1100);
  }

  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDb();