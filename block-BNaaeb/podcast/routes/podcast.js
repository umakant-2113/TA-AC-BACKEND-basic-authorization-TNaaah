let express = require('express');
let router = express.Router();

let User = require('../modles/User');
let Podcast = require('../modles/Podcast');
let multer = require('multer');
let path = require('path');
let uploadPath = path.join(__dirname, '../', 'public/images/');
let fs = require('fs');
let auth= require("../middleware/auth")
// console.log(uploadPath)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });




// create podcast

router.use(auth.loggedInUse)

router.get('/new', (req, res, next) => {
    res.render('podcast');
});

// capture data from podcast

router.post(
  '/new',
  upload.fields([
    { name: 'podcastImage', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
  ]),
  (req, res, next) => {
    console.log(req.body);
    req.body.podcastImage = req.files.podcastImage[0].filename;
    req.body.audio = req.files.audio[0].filename;
    Podcast.create(req.body, (err, podcast) => {
      if (err) return next(err);
      res.redirect('/users');
    });
  }
);



// podcast list
router.get('/', (req, res, next) => {
  Podcast.find({}, (err, podcasts) => {
    if (err) return next(err);
    console.log(podcasts)
    res.render('podcast-list', { podcasts });
  });
});

// details podcast

router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Podcast.findById(id, (err, podcast) => {
    if (err) return next(err);
    res.render('details', { podcast });
  });
});
// edit podcast

router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  let userId = req.user.id;
  User.findById(userId, (err, user) => {
    if (user.isAdmin == true) {
      Podcast.findById(id, (err, podcast) => {
        if (err) return next(err);
        res.render('update-podcast', { podcast });
      });
    } else {
      res.redirect('/podcasts/' + id);
    }
  });
});

//

router.post('/:id/edit'  ,upload.fields([{ name: 'podcastImage', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), (req, res, next) => {
  let id = req.params.id;
  let newAudio = '';
  let newImage = '';
  if (req.files) {
    let audio = req.files.audio
    let podcastImage = req.files.podcastImage

    if (audio) {
      newAudio = audio[0].filename;
      try {
        fs.unlinkSync(uploadPath + req.body.audio);
      } catch (err) {
        console.log(err);
      }
    }

    if (podcastImage) {
      newImage = podcastImage[0].filename;
    }
    try {
      fs.unlinkSync(uploadPath + req.body.podcastImage);
    } catch (err) {
      console.log(err);
    }
  } else {
    newAudio = req.body.audio;
    newImage = req.body.podcastImage;
  }
  
  req.body.audio = newAudio;
  req.body.podcastImage = newImage;

  Podcast.findByIdAndUpdate(id, req.body, (err, podcast) => {
    if (err) return next(err);
    res.redirect('/podcasts');
  });
});

// delete image and audio
router.get('/:id/delete', (req, res, next) => {
  let userid=req.user.id;
  let id = req.params.id

  User.findById(userid,(err,user)=>{
    
if(user.isAdmin==true){

  Podcast.findByIdAndDelete(id, (err, podcast) => {
      if (err) return next(err)
      if (podcast.audio) {
          try {
              fs.unlinkSync(uploadPath + podcast.audio)
          } catch (error) {
              console.log(error)
          }
      }
      if (podcast.cover_image) {
          try {
              fs.unlinkSync(uploadPath + podcast.podcastImage)
          } catch (error) {
              console.log(error)
          }
      }
      res.redirect('/podcasts')
  })

}else{
  res.redirect("/podcasts/"+id)
}

  })
})





module.exports = router;
