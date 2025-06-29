if(process.env.NODE_ENV != "production"){
   require('dotenv').config()
}

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
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const passport = require("passport");
const LocalStratagy = require("passport-local");
const User = require("./models/user")
const userRouter = require("./routes/user")
const mongoUrl = process.env.MONGO_URL

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"/views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


main().then((res)=>{
    console.log("database successfully connected");
    
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongoUrl);
}

const Store =  MongoStore.create({
    mongoUrl:mongoUrl,
    crypto:{
      secret:process.env.SECRET,
      touchAfter: 24 * 3600
    }
})

Store.on("error",(err)=>{
  console.log("Error in MongoDB Session", err)
})

const sessionOption = {
  Store,
 secret:process.env.SECRET,
 resave:false,
 saveUninitialized:true,
  cookie:{
    expires:Date.now()+ 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,  //cross Scripting attacks
  }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratagy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",(req,res)=>{
    res.send("hello root");
})

app.use((req,res,next)=>{
   res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
     res.locals.currUser = req.user
   next();
})
app.use("/listings", listing)
app.use("/listings/:id/reviews", reviewRouter);
app.use("/" , userRouter);

 app.all("*", (req,res,next)=>{
   next(new ExpressError(404 ,"Page is Not Found"));
 })

// Actual error handler

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  res.status(status).render("listings/error",{status , message});
});



app.listen(8080,(req,res)=>{
    console.log(`server listening on the port 8080`);
});