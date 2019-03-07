var express = require("express");
var router = express.Router();
var Runspot = require("../ModelsBare/runSpotsMD"),
    middleware  = require("../middlewareBare"),
    NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//INDEX - Show all runSpots. 
router.get("/", function(req, res){
    Runspot.find({}, function (err, allRunspots){
        if(err){
            console.log("Error");
            console.log(err);
        } else {
            res.render("runSpotsViews/runSpotsVW", {runSpots: allRunspots, currentUser: req.user});
        }
    });
});

//CREATE ROUTE- Colts from the Video. 
router.post("/", middleware.isLoggedIn,  function(req, res){
    //get data from form and add to runSpots array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.descrip;
    var author = {
        id: req.user,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            console.log(err);
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newRunspot = {name: name, image: image, descrip: desc, author: author, location: location, lat: lat, lng: lng};
    // Create a new runSpot and save to DB
    Runspot.create(newRunspot, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to runSpots page
            console.log(newlyCreated);
            req.flash("success", "Runspot added");
            res.redirect("/runSpots");
        }
    });
});
});


//NEW ROUTE - show form to create new runSpot. 
router.get("/newBareVW", middleware.isLoggedIn, function(req, res){
    res.render("runSpotsViews/newBareVW");
});

//SHOW ROUTE-  more info about ONE runSpot
router.get("/:id", function(req, res){
    //find runSpot with id
    Runspot.findById(req.params.id).populate("comments").exec(function(error, foundRunspot){
        if(error){
            console.log(error);
        } else {
            console.log(foundRunspot.name);
            console.log(foundRunspot.author);
            console.log(foundRunspot.descrip);
            res.render("runSpotsViews/showBareVW", {runSpot: foundRunspot});
        }
    });
});

//EDIT ROUTE- Get Edit Form
router.get("/:id/editFormBareVW", middleware.isLoggedIn, middleware.checkRunspotOwnership, function(req, res){
    Runspot.findById(req.params.id, function(err, foundRunspot){
        res.render("runSpotsViews/editFormBareVW", {runSpot: foundRunspot});
    });
});

//UPDATE ROUTE - Update page after editting
router.put("/:id/", middleware.checkRunspotOwnership, function(req, res){
    geocoder.geocode(req.body.location, function(err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        req.body.runSpot.lat = data[0].latitude;
        req.body.runspot.lng = data[0].longitude;
        req.body.runSPot.location = data[0].formattedAddress;
        req.body.runSpot.descrip = req.sanitize(req.body.runSpot.descrip);
        //Find runSpot using ID.
        Runspot.findByIdAndUpdate(req.params.id, req.body.runSpot, function(err, UpdatedRunspot){
        if(err){
            res.send("oops");
            res.redirect("/runSpotsVW");
        } else {
            req.flash("success", "Runspot editted");
            res.redirect("/runSpots/" + req.params.id);  //UpdatedRunspot._id);
        }
        });
    });
});

//DELETE ROUTE
router.delete("/:id/", middleware.checkRunspotOwnership, function(req,res){
    Runspot.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else{
            req.flash("success", "Runspot successfully deleted");
            res.redirect("/runSpots");
        }
    });
});



module.exports = router;