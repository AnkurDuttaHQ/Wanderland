const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapasync");
const {isLoggedIn, validateReview} = require("../middleware")
const reviewControlletr = require("../Controllers/review");

//Review Route
router.post("/", isLoggedIn, validateReview,wrapAsync(reviewControlletr.createReview));

 //Review Delete Route
 router.delete("/:reviewId", wrapAsync(reviewControlletr.deleteReview));

 module.exports = router;