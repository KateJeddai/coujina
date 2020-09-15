const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {User} = require('../backend/models/user');

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "/auth/google/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            userName: profile.name.givenName,
            lastName: profile.name.familyName,
            imagePath: profile.photos[0].value,
            createdAt: Date.now()
        };
        try {
            let user = await User.findOne({googleId: profile.id});
            if(user) {
                done(null, user);
            } else {
                user = await User.create(newUser);
                done(null, user);
            }
        } catch(err) {
            console.log(err);
        }          
      }
    )); 
}
