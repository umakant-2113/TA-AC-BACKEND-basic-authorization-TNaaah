let User = require('../models/User');

module.exports = {
  logedInUser: (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    } else {
      req.flash('error', 'login first');
      res.redirect('/users/login');
    }
  },
  userInfo: (req, res, next) => {
    let userId = req.session && req.session.userId;
    if (userId) {
      User.findById(userId, 'name email', (err, users) => {
        if (err) return next(err);
        req.users = users;
        res.locals.users = users;
        next();
      });
    } else {
      req.users = null;
      res.locals.users = null;
      next();
    }
  },
};
