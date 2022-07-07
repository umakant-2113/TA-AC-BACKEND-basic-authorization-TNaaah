var express = require('express');
var router = express.Router();
let User=require("../models/User");
let Block=require("../models/Block");

/* GET users listing. */
router.get("/register", (req,res,next)=>{
res.render("registerform")
})

// capture register form data

router.post("/register",(req,res,next)=>{
  if(req.body.admin=="on"){
    req.body.admin=true;
    User.create(req.body,(err,users)=>{
      if(err) return next(err);
      console.log(user,"true")
      res.redirect("/users/login")
    })
  }else{
    req.body.admin=false
    User.create(req.body,(err,user)=>{
      if(err) return next(err);
      console.log(user, "false")
      res.redirect("/users/login")
    })
  }

});

// login form 

router.get("/login",(req,res,next)=>{
  res.render("login-form")
})

// capture data 

router.post("/login",(req,res,next)=>{
let {email,password}=req.body;
// email and password fill login form
if(!email && !password){
  return res.redirect("/users/login")
}
User.findOne({email},(err,user)=>{
  if(err) return next(err);
  if(!user){
    return res.redirect("/users/login")
  }
  user.verifyPassword(password,(err,result)=>{
    if(err) return next(err);
    if(!result){
      return res.redirect("/users/login")
    } 
    req.session.userId=user.id;
    res.redirect("/products")
  })
})

})


// logout page

router.get('/logout', (req, res, next) => {
  res.clearCookie('connect.sid')
  req.session.destroy()
  res.redirect('/users/login')
})




module.exports = router;
