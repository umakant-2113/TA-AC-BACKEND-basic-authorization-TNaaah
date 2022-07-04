let express = require('express');
let router = express.Router();

let Article = require('../models/Article');
let Comment = require('../models/Comment');
let User = require('../models/User');

let auth = require('../middleware/auth');
// article  list

router.get('/', (req, res, next) => {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render('articlelist', { articles });
  });
});

// article form render
router.get('/new', auth.logedInUser, (req, res, next) => {
  res.render('article');
});

// details router
router.get('/:id', async (req, res, next) => {
  try {
    let id = req.params.id;
    let articles = await  Article.findById(id).populate('comment').populate('userId');
    res.render('article-details', { articles });
  } catch (err) {
  }
});

router.use(auth.logedInUser);

// capture data form article form
router.post('/new', (req, res, next) => {
  req.body.userId = req.users._id;
  Article.create(req.body, (err, articles) => {
    console.log(articles);
    if (err) return next(err);
    res.redirect('/articles');
  });
});

// create comments
router.post('/:id/comment', (req, res, next) => {
  let id = req.params.id;
  req.body.articleId = id;
  req.body.authorId=req.users.id;
  Comment.create(req.body, (err, comments) => {
    Article.findByIdAndUpdate(
      id,
      { $push: { comment: comments.id } },
      (err, articles) => {
        if (err) return next(err);
        res.redirect('/articles/' + id);
      }
    );
  });
});

// likes
router.get('/:id/likes', (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, articles) => {
    if (err) return next(err);
    res.redirect('/articles/' + id);
  });
});

// dislikes

router.get('/:id/dislikes', (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, articles) => {
    if (articles.likes > 0) {
      Article.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, likes) => {
        if (err) return next(err);
        res.redirect('/articles/' + id);
      });
    }
  });
});

// update article

router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, articles) => {
    if (err) return next(err);
    res.render('update-article', { articles });
  });
});

// capture updated data
router.post('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, req.body, (err, articles) => {
    if (err) return next(err);
    res.redirect('/articles/' + id);
  });
});
// delete articles

router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndDelete(id, (err, articles) => {
    if (err) return next(err);
    res.redirect('/articles');
  });
});

// comment section

module.exports = router;
