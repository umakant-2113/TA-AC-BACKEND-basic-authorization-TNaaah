let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');
let userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  category: { type: String },
});

userSchema.pre('save', function (next) {
  let adminEamil = ['lodhiumakant800@gmail.com'];
  if (adminEamil.includes(this.email)) {
    this.isAdmin = true;
  }

  if (this.password && this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) return next(err);
      this.password = hashed;
      return next();
    });
  } else {
    return next();
  }
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    cb(err, result);
  });
};

module.exports = mongoose.model('User', userSchema);
