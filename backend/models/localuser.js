const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const LocalUserSchema = new Schema({
      username: {
        type: String,
        required: true,
        unique: true
      },
      email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
              validator: validator.isEmail,
              message: '{VALUE} is not a valid email'
            }
      },
      password: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
          validator: function(v) {
               return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(v)
          },
          message: 'Password must be at least 8 characters length and include at least: one uppercase character, one lowercase character, one number and a special character'
        }  
      },
      imagePath: {
        type: String,
        required: false
      },
      verified: {
        type: Boolean,
        required: true,
        default: false
      },
      confirmToken: {
        type: String
      },
      admin: {
        type: Boolean,
        default: false
      },
      savedRecipes: [{
        recipe: {
          type: Schema.Types.ObjectId,
          ref: 'Recipe'
        }
      }] 
});


LocalUserSchema.pre('save', function(next) {
      const user = this;
      if(user.isModified('password')) {
         bcrypt.genSalt(10, (err, salt) => {
           bcrypt.hash(user.password, salt, (err, hash) => {
             user.password = hash;
             next();
           })
         })
      }
      else if(!user.isModified('password')) {
        next();
      }
  })

LocalUserSchema.statics.findByCredentials = function(username, password) {
      const User = this;
      return User.findOne({username})
                 .then((user) => {
                    if(!user) { 
                        return Promise.reject("Username or password is incorrect.");
                    }
                    return new Promise((resolve, reject) => {
                        bcrypt.compare(password, user.password, (err, res) => {
                            if(res) {
                              resolve(user);
                            }
                            else {
                              reject("Username or password is incorrect.");
                            }
                        })
                    })
                 })
  }

LocalUserSchema.methods.createAuthToken = function(access) {
      const user = this;
      const token = jwt.sign({_id: user._id.toHexString(), access}, 
                              process.env.JWT_SECRET,
                              {expiresIn: '3h'}).toString();
      const tokens = [{access, token}];
      return LocalUser.updateOne({_id: user._id}, { tokens }, {new: true})
          .then(() => {
              return token;
           })
          .catch(err => {
              res.status(400).send({errors: "Something went wrong"})
          })
  }

  const LocalUser = mongoose.model('LocalUser', LocalUserSchema);

  module.exports = {LocalUser};
