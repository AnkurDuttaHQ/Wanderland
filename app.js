if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Imports
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError");
const reviewRouter = require("./routes/review");
const listing = require("./routes/listing");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const userRouter = require("./routes/user");

// Environment variables
const mongoUrl = process.env.MONGO_URL;
const port = process.env.PORT || 8080;

// Set view engine & public files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Connect to MongoDB
main()
  .then(() => console.log("✅ Database successfully connected"))
  .catch((err) => console.log("❌ DB Error:", err));

async function main() {
  await mongoose.connect(mongoUrl);
}

// Session Store Configuration
const Store = MongoStore.create({
  mongoUrl: mongoUrl,
  secret: process.env.SECRET,
  touchAfter: 24 * 3600,
});

Store.on("error", (err) => {
  console.log("❌ Error in MongoDB Session Store:", err);
});

// Trust Proxy for Render (needed for secure cookies)
app.set("trust proxy", 1);

// Session Config
const sessionOption = {
  store: Store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  },
};
app.use(session(sessionOption));
app.use(flash());

// Passport Config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash & Current User Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Routes
app.use("/listings", listing);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Home
app.get("/", (req, res) => {
  res.send("Hello Root Route Working!");
});

// 404 Handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Error Handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  res.status(status).render("listings/error", { status, message });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
