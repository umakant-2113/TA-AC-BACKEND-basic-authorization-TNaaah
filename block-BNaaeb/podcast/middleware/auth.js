let User=require("../modles/User");

module.exports = {
  loggedInUse: (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    }else{
        res.redirect("/users/login")
    }
  },
  userInfo:(req,res,next)=>{
    let userId=req.session && req.session.userId;
    if(userId){
User.findById(userId,"name email",(err,user)=>{
    // console.log(user)
    if(err) return next(err);
    req.user=user;
    res.locals.user=user;
    next()
})
    }else{
        req.user=null;
        res.locals.user=null;
        next()  
    }
  }
};
