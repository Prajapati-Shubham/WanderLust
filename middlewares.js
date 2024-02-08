const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");



module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.path ,"..",req.originalUrl );
  // console.log(req);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};


module.exports.isOwner= async(req,res,next)=>{
  let { id } = req.params;

  let listing = await Listing.findById(id);
  // console.log(res.locals.currUser);
  if (! listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.isReviewAuthor= async(req,res,next)=>{
  let {id,reviewId } = req.params;

  let review = await Review.findById(reviewId);
  // console.log(res.locals.currUser);
  if (! review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this Review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}


//Validate listing middleware
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  // console.log(result);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//validationg review middleware
module.exports.validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
      // console.log(result);
      if(error){
          let errMsg=error.details.map((el)=>el.message).join(",");
          throw new ExpressError(400,errMsg)
      }
      else{
          next();
      }
}