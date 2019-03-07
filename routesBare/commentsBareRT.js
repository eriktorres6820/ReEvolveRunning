var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Comment     = require("../ModelsBare/commentsBareMD"),
    RunSpot  = require("../ModelsBare/runSpotsMD"),
    middleware  = require("../middlewareBare");
    


// ===============
// COMMENTS ROUTES
// ===============
//NEW Comment Ruote
router.get("/new", middleware.isLoggedIn, function(req, res){
    RunSpot.findById(req.params.id, function(err, runSpot){
        if(err){
            console.log(err);
        } else {
            res.render("commentsBareViews/newcommentBareVW", {runSpot: runSpot});
        }
    });
});

//Create Comment Route
router.post("/", middleware.isLoggedIn, function(req,res){
    RunSpot.findById(req.params.id, function(err, runSpot){
        if(err){
            console.log(err);
            res.redirect("/runSpotsVW");
        } else {
            //console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //add username password
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    runSpot.comments.push(comment);
                    runSpot.save();
                    console.log(comment);
                    req.flash("success", "Successfully added a comment");
                    res.redirect('/runSpots/' + runSpot._id);
                }
            });
        }
    });
});

//Edit Route - Get Edit Form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("commentsBareViews/editcommentBareVW", {runSpot_id: req.params.id, comment: foundComment});
        }
    });
});

//Update Route - Update Comment 
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          req.flash("success", "Successfully editted a comment");
          res.redirect("/runSpots/" + req.params.id);
      }
  });
});

//Delete Route - Delete comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){
          res.redirect("back");
      } else {
          req.flash("success", "Comment Deleted");
          res.redirect("/runSpots/" + req.params.id);
      }
   }); 
});

// function checkCommentOwnership(req, res, next) {
//     //Is logged in?
//     if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id, function(err, foundComment){
//             if(err){
//                 res.redirect("back");
//             } else {
//                 //Is the owner?
//                 if(foundComment.author.id.equals(req.user._id)){
//                     next();
//                 } else {
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else {
//         res.redirect("back");
//     }
// }

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;