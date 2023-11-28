let mongoose = require("mongoose");
let bcrypt = require("bcrypt");

let userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  age: { type: Number, required: true },
  phone: { type: Number, required: true },
});

userSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      try {
        this.password = hashed;
        next();
      } catch (error) {
        next(error);
      }
    });
  } else {
    next();
  }
});
userSchema.methods.verifyPassword = function (password) {
  return new Promise((res, rej) => {
    bcrypt.compare(password, this.password, (err, result) => {
      if (err) {
        rej(err);
      } else {
        res(result);
      }
    });
  });
};
module.exports = mongoose.model("User", userSchema);
