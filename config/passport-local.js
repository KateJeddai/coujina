const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const {LocalUser} = require('../backend/models/localuser');

 const localStrategy = new LocalStrategy({ usernameField: 'username'}, async (username, password, done) => {
            try {
                const user = await LocalUser.findOne({username: username, verified: true});
                console.log(user)
                if(!user) {
                    return done(null, false, { message: 'Username or password is incorrect' });
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Username or password is incorrect'});
                }                
            } catch(err) {
                throw new Error('Couldn\'t authenticate the user');
            }
        })

module.exports = {localStrategy};
