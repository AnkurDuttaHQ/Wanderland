const mongoose = require("mongoose");
const Listing = require("../models/Listing");
const User = require("../models/user");
const getSampleListings = require("../init/data");

main()
  .then(() => {
    console.log("✅ MongoDB connected");
    return seed();
  })
  .catch((err) => {
    console.log("❌ MongoDB error", err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlands");
}

const seed = async () => {
  await Listing.deleteMany({});
  await User.deleteMany({});

  const user = new User({ username: "Ankur Dutta", email: "ankur@example.com" });
  await user.save();

  const sampleListings = getSampleListings(user._id);
  await Listing.insertMany(sampleListings);
  console.log("✅ DB seeded successfully");
  mongoose.connection.close();
};
