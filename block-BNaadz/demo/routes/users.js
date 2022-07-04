var express = require('express');
var router = express.Router();
let User=require("../models/User")
/* GET users listing. */
router.get("/",(req,res,next)=>{
  res.render("home")
})

// register form 
router.get("/register",(req,res,next)=>{
  res.render("registerform")
})

// capture register form data

router.post("/register",(req,res,next)=>{
User.create(req.body,(err,users)=>{
  if(err) return next(err);
  res.redirect("/users/login")
})
})

// login form render

router.get("/login",(req,res,next)=>{
  var error=req.flash("error")
  res.render("login",{error})
})

// capture date login form

router.post("/login",(req,res,next)=>{
  let {email,password}=req.body
  if(!email && !password){
    return res.redirect("/users/login")
  }
  User.findOne({email},(err,user)=>{
    if(err) return next(err);
    if(!user){
      return res.redirect("/users/login") 
    }
    user.verifyPassword (password, (err,result)=>{
      if(err) return next(err);
      if(!result){
        return res.redirect("/users/login")   
      } 
      console.log("login process successfully")
      req.session.userId=user.id;
      res.redirect("/articles")
    })
  })
})

// logout router

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
})


module.exports = router;
