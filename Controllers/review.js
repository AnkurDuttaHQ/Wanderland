const Listing = require("../models/Listing");
const Reviews = require("../models/reviews");

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newreview = new Reviews(req.body.reviews);
    newreview.author = req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
   req.flash("success" , "New Review Added");
   res.redirect(`/listings/${req.params.id}`);

}

module.exports.deleteReview = async(req,res)=>{
    let {id ,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success" , "Review Deleted");
    res.redirect(`/listings/${id}`);
 }