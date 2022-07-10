var express = require('express');
var router = express.Router();
let User=require("../modles/User")
let Podcast=require("../modles/Podcast")
/* GET users listing. */

// register form render

router.get("/register",(req,res,next)=>{
  res.render("registerForm")
})

// capture user data

router.post("/register",(req,res,next)=>{

User.create(req.body, (err,user)=>{
  if(err) return next(err);
  res.redirect("/users/login")
})
})

// login form

router.get("/login",(req,res,next)=>{
  res.render("login")
})

// capture data login form

router.post("/login",(req,res,next)=>{
  let {email,password}=req.body;
  if(!email && !password){
    return res.redirect("/users/login");
  }
  // email compare with login  
  User.findOne({email},(err,user)=>{
    if(err) return next(err);
    if(!user){
      return res.redirect("/users/login"); 
    }
    // password compares
user.verifyPassword(password,(err,result)=>{
  if(err) return next(err);
  if(!result){
    return res.redirect("/users/login"); 
  }
  console.log("login process successful")
  req.session.userId=user.id;
  res.redirect("/users")
})
  })
})

// lougout

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.clearCookie('connect.sid')
  res.redirect('/users/login')
})

// // filter podcast

router.get("/",(req,res,next)=>{
  let userId=req.user.id;
User.findById(userId, (err,user)=>{
 
  if(err) return next(err);

  if(user.isAdmin){
    Podcast.find({},(err,podcasts)=>{
      if(err) return next(err)
      res.render("admin",{podcasts});
    })
  }else{
    console.log(user.category) 
// free subscription
if(user.category  ==  "Free"){
Podcast.find({category:"Free"},(err,podcasts)=>{
  if(err) return next(err);
  res.render("admin",{podcasts});
})

}

if(user.category==="VIP"){
  Podcast.find({category:"Free"},(err,podcastF)=>{
    if(err) return next(err);
    Podcast.find({category: "VIP"},(err,podcastV)=>{
      if(err) return next(err);
      podcasts=podcastF.concat(podcastV);
      res.render("admin",{podcasts});
    })
  })
}

if(user.category==="Premium"){
Podcast.find({}, (err,podcasts)=>{
  if(err) return next(err);
 res.render("admin",{podcasts})
}) 
}
  }
})
})

// update user cateagory

router.post("/updateCategory",(req,res,next)=>{
  let userId=req.user.id;
User.findById(userId,(err,user)=>{
  User.findByIdAndUpdate(userId,req.body,(err,user)=>{
    res.redirect("/users")
  })
})


})

module.exports = router;
