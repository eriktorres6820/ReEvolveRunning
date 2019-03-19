var express = require("express"),
    router  = express.Router(),
    passport= require("passport"),
    User    = require("../ModelsBare/runnerMD");

//Root Route
router.get("/", function(req, res){
    res.render("landingBareVW");
});


router.get("/secretsecretBareVW", function(req, res){
    res.render("secretBareVW");
});

// show registration form
router.get("/registerBareVW", function(req, res){
    res.render("authBareViews/registerBareVW");
});

//Handle User Registration
router.post("/registerBareVW", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log("DANGER");
            //console.log(err);
            req.flash("error", err.message);
            return res.redirect("/registerBareVW");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome " + user.username);
            res.redirect("/runSpots");
        });
    });
});

// show login form
router.get("/loginBareVW", function(req, res){
    res.render("authBareViews/loginBareVW");
});

// lOGIN LOGIC
router.post("/loginBareVW", passport.authenticate("local", 
    {
        successRedirect: "/runSpots",
        failureRedirect: "/loginBareVW"
    }), function(req, res){
});
   
   //logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/runSpots");
});

//middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;