const User = require("../models/user")

module.exports.signupForm = (req,res)=>{
    res.render("user/signup")
}

module.exports.postSignup = async(req,res)=>{
    try{
         let {username , email , password} = req.body;
  let newUser = new User({username , email})
  const registerUser = await User.register(newUser , password);
  req.login(registerUser , (err)=>{
      if(err){
        return next(err)
      }
       req.flash("success" ,"Welcole To Wanderland");
  res.redirect("/listings");
  })
    } catch(e){
  req.flash("error" , e.message);
   res.redirect("/signup")
    };

}

module.exports.loginForm = (req,res)=>{
        res.render("user/login")
     };

     module.exports.postlogin = async(req,res)=>{
            req.flash("success" , "Logged in successfully")
            res.redirect(res.locals.redirectUrl || "/listings");
        }

    module.exports.logout = (req,res,next)=>{
      req.logOut((err)=>{
        if(err){
            return next(err)
        }
         req.flash("success", "You Logout")
         res.redirect("/listings")
      })
    }