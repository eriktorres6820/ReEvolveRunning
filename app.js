require('dotenv').config();
var express               = require("express"),
    app                   = express(),
    session               = require("express-session"),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    flash                 = require("connect-flash"),
    methodOverride        = require("method-override"),
    expressSanitizer      = require("express-sanitizer"),
    request               = require('request'),
    //seedDB                = require("./seed"),
    User                  = require("./ModelsBare/runnerMD"),
    passport              = require("passport"),
    localStrategy         = require("passport-local"),
    runSpotRoutes         = require("./routesBare/runSpotsRT"),
    commentRoutes         = require("./routesBare/commentsBareRT"),
    indexRoutes           = require("./routesBare/indexBareRT");

var db  = mongoose.connection;
var url = process.env.DATABASEURL || "mongodb://localhost:27017/runningsports";
mongoose.connect(url, { useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //console.log(__dirname);
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressSanitizer());
//seedDB(); // seed the db

// PASSPORT CONFIGURATION
app.use(session({
    secret: "Sucka Lucka Ding Dong",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

 //adding from mongoose docs
// Testing conection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
   console.log('Connection established'); 
});

app.use("/", indexRoutes);
app.use("/runSpots", runSpotRoutes);
app.use("/runSpots/:id/comments", commentRoutes);

//Start server
app.listen(3000 || process.env.PORT, process.env.IP, function(){
    console.log("The Barefoot Server Started");
});

