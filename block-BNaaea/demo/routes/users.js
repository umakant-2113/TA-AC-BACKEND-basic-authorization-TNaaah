var express = require('express');
var router = express.Router();
let User=require("../models/User");
let Block=require("../models/Block");

/* GET users listing. */
router.get("/register", (req,res,next)=>{
res.render("registerform")
})

router.post("/register",(req,res,next)=>{
User.create(req.body,(err,users)=>{
  if(err) return next(err);
  console.log(users)
  res.redirect("/users/login")
})
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
  return  res.redirect("/users/login");
}
else if(email==="lodhiumakant800@gmail.com"){
  // find user data from data base 
  User.findOne({email},(err,user)=>{
    if(err) return  next(err);
    if(!user){
      return  res.redirect("/users/login");
    }
    // verify password from data base
user.verifyPassword(password,(err,result)=>{
  if(err) return  next(err);

  if(!result){
    return  res.redirect("/users/login");
  }
  req.session.userId = user._id
  return res.redirect('/users/admin')

})

  })
}
else{
  User.findOne({email} ,(err,user)=>{
    if(err) return next(err);
    if(!user){
      return  res.redirect("/users/login");
    }
    Block.find({},(err,data)=>{
      if(err) return next(err);
data.forEach(elm=>{
  if(elm[0].equals(user.id)){
    return res.redirect('/users/login')
  }else{
    user.varifyPassword(password,(err,result)=>{
      if (err) return next(err)
      if(!result){
        return res.redirect('/users/login') 
      }
      req.session.userId = user._id
      return res.redirect('/users')
    })
  }
})
    })
  })
}
})

// logout page

router.get('/logout', (req, res, next) => {
  res.clearCookie('connect.sid')
  req.session.destroy()
  res.redirect('/users/login')
})




module.exports = router;
