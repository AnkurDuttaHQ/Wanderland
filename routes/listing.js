const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync");
const { isLoggedIn , isOwner , validateError} = require("../middleware");
const controllersListing = require("../Controllers/listing");
const multer  = require('multer')
const{ storage} = require("../cloudConfig")
const upload = multer({storage});

router
.route("/")
//Index route
.get( wrapAsync(controllersListing.index))
// New list add route
.post(isLoggedIn,upload.single("image"), validateError, wrapAsync(controllersListing.newListing));

//new get Route
router.get("/new",isLoggedIn,controllersListing.getNewform);

router.route("/:id")
// show Route
.get(wrapAsync(controllersListing.showListing))
//update route
.put(isLoggedIn,upload.single("listing[image]"), validateError,wrapAsync(controllersListing.update))
//delete route
.delete( isLoggedIn,isOwner, wrapAsync(controllersListing.destroy));


//edit route
router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync(controllersListing.edit))



module.exports = router;