const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const {localStrategy} = require('../config/passport-local');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); 
require('../config/config');
const {Recipe} = require('./models/recipe');
const {User} = require('./models/user');
const {LocalUser} = require('./models/localuser');
const recipes = require('./routes/recipes');
const auth = require('./routes/auth');

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// const myOAuth2Client = new OAuth2(
//     "client ID goes here",
//     "client secret goes here",
//     "https://developers.google.com/oauthplayground"
//     )

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.ADMIN_PASS}@cluster0.kgdr1.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {useNewUrlParser: true, useCreateIndex: true})
        .then(() => {
            console.log('Mongo connected');
        })
        .catch((err) => {
            console.log(err);
        });

const connection = mongoose.connection;
    connection.on('connected', () => {
        app.locals.db = connection.db;
    });   

mongoose.set('useFindAndModify', false);

// passport

passport.use('local', localStrategy);
require('../config/passport-google')(passport);

passport.serializeUser((user, done) => {
    let type = user.googleId ? 'google' : 'local';
    done(null, {id: user.id, type });
}) 
  
passport.deserializeUser((data, done) => {
    if(data.type === 'google') {
        User.findById(data.id, function(err, user) { 
            done(err, user);
        });
    } else {
        LocalUser.findById(data.id, function(err, user) {  
            done(err, user);
        });
    }
});

const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' })
app.use(session({
    secret: process.env.GOOGLE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}))

app.use(passport.initialize());
app.use(passport.session());

app.use("/images", express.static(path.join("backend/images")));
app.use('/recipes', recipes);
app.use('/auth', auth);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
} 

module.exports = {app};    
