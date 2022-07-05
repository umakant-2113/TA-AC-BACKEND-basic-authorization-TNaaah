let express=require("express");
let router=express.Router();
let Product=require("../models/Product");
let User= require("../models/User")
let multer=require("multer");

let fs=require("fs");
let path=require("path");

let uploadPath = path.join(__dirname, '../', 'public/images');


let storage = multer.diskStorage({
    destination : function (req, file, cb) {
            console.log(req.file)
        cb(null,  uploadPath)
    },
    filename: function (req, file, cb) {
        console.log(req.file)
        cb(null, Date.now() + '-' + file.originalname)
    }
})

let upload = multer({ storage: storage })

// product 




router.get("/",(req,res,next)=>{
    Product.find({},(err,products)=>{
        console.log(products)
        if(err) return next(err);
        res.render("list",{products})
     })
})


// product form render

router.get("/new",(req,res,next)=>{
    res.render("product")
})

// capture data

router.post('/new',  upload.single('productImage'), (req, res, next) => {
    console.log(req.file.filename)
        req.body.productImage = req.file.filename
    Product.create(req.body, (err, product) => {
        console.log(product)
        if (err) return next(err)
        res.redirect('/products')
    })
})

// details page 

router.get("/:id/details",(req,res,next)=>{
    let id=req.params.id;
    Product.findById(id,(err,product)=>{
        if(err) return next(err);
        res.render("details",{product})
    })
})

// edit product

router.get("/admin" ,  (req,res,next)=>{
let query=req.query.product;
let obj={};
if(query !==undefined){
    obj.category=query;
}
    User.find({},(err,users)=>{ 
        Product.find(obj,(err,products)=>{
            if(err) return next(err)
            Product.distinct("category",(err,category)=>{
                if(err) return next(err) 
                res.render("admin",{ users  ,  products ,category})
            }) 
        })
       })  
})



// add cart 

router.get("/:id/cart",(req,res,next)=>{
    let id=req.params.id;
    Product.findById(id,(err,product)=>{
        if(err) return next(err);
        res.render("cart",{product})
    })
})

// filter


module.exports=router;
