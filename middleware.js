const Listing = require("./models/Listing");
const ExpressError = require("./utils/expressError");
const {ListingSchema , reviewSchema} =  require("./joiSchema");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
      req.flash("error","You must be login first")
      res.redirect("/login")
   } 
   next();
}

module.exports.saveUrl = (req,res,next)=>{
   if(req.session.redirectUrl){
        res.locals.redirectUrl =  req.session.redirectUrl
   }
   next();
}

module.exports.isOwner = async (req,res,next)=>{
    const { id } = req.params;
     const editlisting = await  Listing.findById(id);
      if(req.user && !editlisting.owner.equals(req.user._id)){
         req.flash("error" , "You are not owner of this post");
        return res.redirect(`/listings/${id}`);
      }
      next();
}

module.exports.validateError  = (req,res,next)=>{
    let result = ListingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400, result.error)
   } else{
    next();
   }
}

module.exports.validateReview = (req,res,next)=>{
 let result = reviewSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400, result.error)
   } else{
    next();
   }
}