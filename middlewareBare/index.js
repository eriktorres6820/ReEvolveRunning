var Runspot = require("../ModelsBare/runSpotsMD");
var Comment = require("../ModelsBare/commentsBareMD");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkRunspotOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Runspot.findById(req.params.id, function(err, foundRunspot){
           if(err || !foundRunspot){
               req.flash("error", "Runspot not found");
               res.redirect("/runSpotsVW");
           }  else {
               // does user own the runSpot?
               if(foundRunspot.author.id.equals(req.user._id)) {
                   next();
                   
               } else {
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You are not the runSpot owner!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
               req.flash("error", "Comment doesn't exist");
               res.redirect("/runSpotsVW");
           } else {
               // does user own the comment?
               if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
                
           }
        });
    } else {
        req.flash("error", "You are not the Comment author");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/loginBareVW");
};

module.exports = middlewareObj;