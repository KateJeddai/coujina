const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    googleId: {
      type: String,
      required: true
    },
    displayName: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    imagePath: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    savedRecipes: [{
      recipe: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe'
      }
    }] 
});

  const User = mongoose.model('User', UserSchema);

  module.exports = {User};
  