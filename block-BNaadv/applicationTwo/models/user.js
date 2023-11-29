let mongoose = require("mongoose");
let bcrypt = require("bcrypt");

let userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, minlength: 5 },
});

userSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, hash) => {
      if (!err) {
        this.password = hash;
        next();
      } else {
        console.log("error hasging the password");
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
