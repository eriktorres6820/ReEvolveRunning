var mongoose = require("mongoose");

//SCHEMA SETUP
var runspotSchema = new mongoose.Schema({
    name:       String,
    price:      String,
    image:      String,
    descrip:    String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments:   [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:  "Comment"
        }],
    date:       {type: Date, default: Date.now}
});

module.exports = mongoose.model("Runspot", runspotSchema );