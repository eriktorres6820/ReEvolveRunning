var express               = require("express"),
    app                   = express(),
    session               = require("express-session"),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    flash                 = require("connect-flash"),
    methodOverride        = require("method-override"),
    expressSanitizer      = require("express-sanitizer"),
    //seedDB                = require("./seed"),
    User                  = require("./ModelsBare/runnerMD"),
    passport              = require("passport"),
    localStrategy         = require("passport-local");

var runSpotRoutes         = require("./routesBare/runSpotsRT"),
    commentRoutes         = require("./routesBare/commentsBareRT"),
    indexRoutes           = require("./routesBare/indexBareRT");

var db                = mongoose.connection;
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
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Barefoot Server Started");
});

/*========== git basics =================================*/
/*
  Commands                                  Description
  -----------------------------------------------------------------------
* git init                                  Initializes git repository
* git status                                Display current status of git
* git add fileName.type                     Begin tracking designated files
* git commit -m "Commit Message Here"       Commit added files with "message about file"
* git log                                   Display all commits and CommitIds
* git checkout CommitId                     Detached head to previous commit
* git revert --no-commit CommitId..HEAD     Revert master to previous commit
* q                                         Exit git log

* To push to github
    git push -u origin master

/* NOTE files must be added everytime before committing*/



/*============ Mongoose and mongo commands ================= */
/*
    $ mongo          // start program
    show dbs         // show databases
    use NAME         // switch to database called NAME
    show collections // shows all the collections in the database
    db.NAME.find()   // shows Key Valley pairs contained in the database
    db.NAME.drop()   // Deletes collections
    db.dropDatabase()// Deletes database
*/

/*=============== Heroku commands =========================*/
/*
* NOTE: Must add the following to package.json: "start": "node app.js"
    See file for location
* to login:
    heroku login -i
    
* heroku create
    create a new heroku app

* git remote -v                             
    Display remote to/from heroku
    
* git push heroku master                    
    Pushes code to be run to heroku

*heroku logs
    Displays logs for specific app
    
*heroku run CODE 
    Runs CODE

*

*/

/*========== MongoDB Atlas ==============*/

