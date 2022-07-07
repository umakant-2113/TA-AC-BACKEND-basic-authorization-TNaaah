let express = require('express');
let router = express.Router();
let Product = require('../models/Product');
let User = require('../models/User');
let multer = require('multer');
let auth=require("../middleware/auth");
let fs = require('fs');
let path = require('path');



let uploadPath = path.join(__dirname, '../', 'public/images');

// multer use
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

let upload = multer({ storage: storage });

// product list

router.get('/', (req, res, next) => {
  Product.find({}, (err, products) => {
    if (err) return next(err);
    res.render('list', { products });
  });
});

// product form render

router.get('/new', (req, res, next) => {
  res.render('product');
});



// capture data product form 

router.post('/new', upload.single('productImage'), (req, res, next) => {
  req.body.productImage = req.file.filename;
  Product.create(req.body, (err, product) => {
    console.log(product);
    if (err) return next(err);
    res.redirect('/products');
  });
});

// details page

router.get('/:id/details', (req, res, next) => {
  let id = req.params.id;
  Product.findById(id, (err, product) => {
    if (err) return next(err);
    res.render('details', { product });
  });
});

// edit product

router.get('/admin', (req, res, next) => {
  let query = req.query.product;
  let obj = {};
  if (query !== undefined) {
    obj.category = query;
  }
    User.find({}, (err, users) => {
            Product.find(obj, (err, products) => {
                if (err) return next(err);
                Product.distinct('category', (err, category) => {
                  if (err) return next(err);
                  res.render('admin', { users, products, category });
                });
              });
      });
});

// add cart

router.get('/:id/cart', (req, res, next) => {
  let id = req.params.id;
  Product.findById(id, (err, product) => {
    if (err) return next(err);
    res.render('cart', { product });
  });
});

// update with

router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;

      Product.findById(id, (err, product) => {
        if (err) return next(err);
        res.render('update-product', { product });
      });
    
  })


// cappture update data

router.post('/:id/edit', upload.single('productImage'), (req, res, next) => {
  let id = req.params.id;
  let newImage = '';
  if (req.file) {
    newImage = req.file.filename;
    try {
      // delet old image
      fs.unlinkSync(uploadPath + req.body.productImage);
    } catch (error) {
      console.log(error);
    }
  } else {
    newImage = req.body.productImage;
  }
  req.body.productImage = newImage;

  Product.findByIdAndUpdate(id, req.body, (err, product) => {
    if (err) return next(err);
    res.redirect('/products/' + id + '/details');
  });
});

// delete product
router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
      Product.findOneAndDelete(id, (err, product) => {
        if (err) return next(err);
        res.redirect('/products');
      });
   
  })


// likes product

router.get('/:id/likes', (req, res, next) => {
  let id = req.params.id;
  Product.findByIdAndUpdate(id, { $inc: { like: 1 } }, (err, product) => {
    if (err) return next(err);
    res.redirect('/products/' + id + '/details');
  });
});

// dislikes

router.get('/:id/dislikes', (req, res, next) => {
  let id = req.params.id;
  Product.findById(id, (err, product) => {
    if (product.like > 0) {
      Product.findByIdAndUpdate(id, { $inc: { like: -1 } }, (err, product) => {
        if (err) return next(err);
        res.redirect('/products/' + id + '/details');
      });
    }
  });
});

// block user

module.exports = router;
