module.exports = function loadUserPassive(req,res,next) {
//console.log("Entered passiveLoad");
    if (req&&req.session&&req.session.user_id) {
        //console.log("Entered If");
        User.findOne({_id:req.session.user_id}, function(err,user) {
            if (user) {
               // console.log("Found User");
                req.currentUser = user;
                next();
            }  else {
                //console.log("User not Found");
                next();
                }
});
} else {
    //console.log("No user logged in");
    next();
}
}
