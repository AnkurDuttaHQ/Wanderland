const Listing = require("../models/Listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAP_TOKEN; // replace with your token
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async (req,res)=>{
    const allListings= await Listing.find({})
    res.render("listings/index",{allListings});
}

module.exports.getNewform = (req,res)=>{
    res.render("listings/new")
}

module.exports.showListing = async(req,res)=>{
    const {id}  = req.params;
    const individualList  = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if (!individualList) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }
    res.render("listings/show",{individualList});
}
module.exports.newListing = async (req, res, next) => {
  try {
    const response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    const newList = new Listing(req.body.listing);
    newList.owner = req.user._id;

    if (req.file) {
      newList.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    // ✅ FIX STARTS HERE
    if (response.body.features.length > 0) {
      newList.geometry = response.body.features[0].geometry;
    } else {
      req.flash("error", "Invalid location. Please try again.");
      return res.redirect("/listings/new");
    }
    // ✅ FIX ENDS HERE

    await newList.save();
    req.flash("success", "New Listing Created");
    res.redirect(`/listings/${newList._id}`);
  } catch (err) {
    console.log("❌ ERROR creating listing:", err.message);
    next(err);
  }
};


module.exports.edit = async (req,res)=>{
    const {id}  = req.params;
    const individualList  = await Listing.findById(id);
    res.render("listings/edit",{individualList});
}

module.exports.update = async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
    if (typeof req.file !== "undefined") {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
      await listing.save()
    }
    
     req.flash("success" , "Update Listing Successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.destroy = async(req,res)=>{
    const {id} = req.params;
   await Listing.findByIdAndDelete(id);
   req.flash("success" , "Deleted Successfully");
    res.redirect("/listings");
}