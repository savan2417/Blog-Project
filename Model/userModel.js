const { error } = require("console");
const {createHmac, randomBytes} = require("crypto");
const mongoose = require("mongoose");
const { createTokenForUser } = require("../Service/auth");

const userSchema = new mongoose.Schema({
  FullName: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  Salt: {
   type: String
  },
  Password: {
    type: String,
    required: true
  },
  ProfileImageUrl: {
    type: String,
    default: "/Images/default.jpg"
  },
  Role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER"
  }
},{
  timestamps: true
})


userSchema.pre("save", function(next){
  const user = this;

  if(!user.isModified("Password")) return ;
  const Salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", Salt).update(user.Password).digest("hex");
  
  this.Salt = Salt;
  this.Password = hashedPassword;

  next();

})


userSchema.static("matchPasswordAndGenerateToken", async function (email, password){
  const user = await this.findOne({Email: email});
  if(!user) throw new Error("User not found!");

  const salt = user.Salt;
  const hashedPassword = user.Password;

  const userPrividedHash = createHmac("sha256", salt).update(password).digest("hex");

   if(hashedPassword !== userPrividedHash) throw new Error("Incorrect Password");

   const token = createTokenForUser(user);

   return token

  

})

const User = mongoose.model("User", userSchema);

module.exports = User