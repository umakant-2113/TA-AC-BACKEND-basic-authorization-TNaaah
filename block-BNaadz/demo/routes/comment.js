let express = require('express');
let router = express.Router();
let Comment = require('../models/Comment');
let Article=require("../models/Article")
let auth=require("../middleware/auth")

// router.use(auth.logedInUser)

router.get("/:id/edit",(req,res,next)=>{
    let id=req.params.id;
    Comment.findById(id,(err,comments)=>{
        if(err) return next(err);
        res.render("update-comment",{comments})
    })
})

// post data updated form

router.post("/:id/edit",(req,res,next)=>{
    let id=req.params.id;
    Comment.findByIdAndUpdate(id,req.body,(err,comments)=>{
        console.log(comments)
        if(err) return next(err);
        res.redirect("/articles/"+comments.articleId)
    })
})

// delete comments
router.get("/:id/delete",(req,res,next)=>{
    let id=req.params.id;
    Comment.findByIdAndDelete(id,(err,comments)=>{
      
        if(err) return next(err);
        res.redirect("/articles/"+comments.articleId)   
    })
})

// like comments
router.get("/:id/likes",(req,res,next)=>{
    let id=req.params.id;
    Comment.findByIdAndUpdate(id,{$inc : {likes:1}},(err,comments)=>{
        if(err) return next(err);
        res.redirect("/articles/"+comments.articleId)   
    })
})

// dislikes

router.get("/:id/dislikes",(req,res,next)=>{
    let id=req.params.id;
    Comment.findById(id,(err,comments)=>{
        if(comments.likes>0){
            Comment.findByIdAndUpdate(id,{$inc : {likes :  -1}},(err,comments)=>{
                if(err) return next(err);
                res.redirect("/articles/"+comments.articleId)     
            })
        }
    })
 
})

module.exports = router;
