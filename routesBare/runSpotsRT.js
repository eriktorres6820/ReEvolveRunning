var express = require("express");
var router = express.Router();
var Runspot = require("../ModelsBare/runSpotsMD"),
    middleware  = require("../middlewareBare");

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
    var desc = req.body.description;
    var author = {
        id: req.user,
        username: req.user.username
    };
    var newRunspot = {name: name, image: image, descrip: desc, author: author};
    console.log(req.user);
    // Create a new runSpot and save to db
    Runspot.create(newRunspot, function(err, newlyCreated){
        if(err){
            console.log("Edic Fail Again111")
            console.log(err);
        } else {
            console.log(newlyCreated);
            req.flash("success", "Runspot added");
            res.redirect("/runSpots");
        }
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
    //Find runSpot using ID. 
    req.body.runSpot.descrip = req.sanitize(req.body.runSpot.descrip);
    Runspot.findByIdAndUpdate(req.params.id, req.body.runSpot, function(error, UpdatedCamp){
        if(error){
            res.send("oops");
            res.redirect("/runSpotsVW");
        } else {
            req.flash("success", "Runspot editted");
            res.redirect("/runSpots/" + req.params.id);
        }
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