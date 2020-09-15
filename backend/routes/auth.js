const express = require('express');
const router = express.Router();
const fs = require('fs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {User} = require('../models/user');
const {LocalUser} = require('../models/localuser');
const {sendMail} = require('../helpers/nodemail');
const {ensureAuthenticated} = require('../middleware/authenticate');
const multer = require('../middleware/multer-storage');

router.get('/google', passport.authenticate('google', { scope: ['profile']  }))
router.get('/google/callback', passport.authenticate('google', 
                                 { failureRedirect: '/login' }), 
                                 (req, res) => {
                                     req.session.cookie.maxAge = 1000 * 60 * 60 * 3;
                                     res.redirect(`/?id=${req.user.googleId}`)                                
                                 })

router.get('/logout', async (req, res) => {
    try {
        await req.logout();
        res.redirect('/login');
    }
    catch(err) {
        res.status(400).json({errors: err.message});
    }
})

router.get('/user', async (req, res) => {
    if(req.user) {
        try {
            let user;
            if(req.user.googleId) {
                user = await User.findOne({_id: req.user._id})
                                .populate('savedRecipes.recipe')
                                .select('-password');
            } else {
                user = await LocalUser.findOne({_id: req.user._id})
                                    .populate('savedRecipes.recipe')
                                    .select('-password');
            }
            res.status(200).send({user: user})
                
        } catch(err) {
            res.status(401).send({errors: err.message})
        }  
    }  
})

router.post('/users', (req, res) => {
    const body = req.body;
    const token = jwt.sign({ username: body.username },
                             process.env.JWT_SECRET,
                             { expiresIn: '24h' }).toString();
    const userBody = {
        username: body.username,
        email: body.email,
        password: body.password,
        verified: false,
        confirmToken: token
    };
    const user = new LocalUser(userBody);
    user.save()
        .then((data) => {
            const host = req.get('host');
            const link = "http://" + host + "/auth/verify?token=" + user.confirmToken;
            const htmlMsg = "Please, click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>";
            sendMail(user, htmlMsg, "verification");
            res.status(200).send({user});
        })
        .catch(err => {
           res.status(400).json({errors: err.message});          
        })
})

router.get('/verify', async (req, res) => {
    const confirmToken = req.query.token;
    const user = await LocalUser.findOne({confirmToken: req.query.token});
    try {
        const decoded = jwt.verify(confirmToken, process.env.JWT_SECRET); 
        user.verified = true;
        await user.save();
        const updatedUser = await LocalUser.findOne({confirmToken: confirmToken});
        res.status(200).redirect(`/login?verification=success`);
    }
    catch(err) {
       res.redirect(`/verification?verified=failed`);
    }
})

router.get('/resend-verification', async (req, res) => {   
    const email = req.query.email;
    try {
        const user = await LocalUser.findOne({email});
        const token = jwt.sign({ username: user.username },
                                 process.env.JWT_SECRET,
                                 { expiresIn: '24h' }).toString();
        const newUser = await LocalUser.findOneAndUpdate({email}, { '$set': { confirmToken: token }}, {new: true});
        const host = req.get('host');
        const link = "http://" + host + "/auth/verify?token=" + user.confirmToken;
        const htmlMsg = "Please, click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>";            
        sendMail(newUser, htmlMsg, "verification");
        res.status(200).send({user});
    }
    catch(err){
        if(err.message === "Cannot read property 'username' of null") {
            res.status(400).json({errors: 'User not found'});  
        }   
    }
})
  
router.post('/login', function(req, res, next) {
    req.session.cookie.maxAge = 1000 * 60 * 60 * 3;
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err); 
        }
        if (!user) {
            return res.send(401, { errors: 'Username or password is incorrect' });
        }
        req.login(user, function(err) {
            if(err) {
                return next(err);
            }
            return res.status(200).send({ message : 'authentication succeeded', user: req.user });        
        });
    })(req, res, next);
})

router.post('/restore-credentials', async (req, res) => {
    const email = req.body.email;
    const credential = req.body.user.username ? 'username' : 'password';
    try {
        const user = await LocalUser.findOne({email});
        const token = jwt.sign({username: user.username}, 
                                process.env.JWT_SECRET, 
                                { expiresIn: '24h' }).toString();
                                
        const newUser = await LocalUser.findOneAndUpdate({email}, { '$set': { confirmToken: token }}, {new: true});
        const host = req.get('host');
        const link = credential === 'username' ? null : 
                                                "http://" + host + "/new-password?token=" + newUser.confirmToken; 
        const htmlMsg = credential === 'username' ? "Your username is " + user.username : 
                                                    "To restore your " + credential + " click<a href=" + link + "> here</a>";                                                    
        sendMail(newUser, htmlMsg, "credential");
        res.status(200).send({user: newUser}); 
    }        
    catch (err) {
        res.status(400).send({errors: err.message});
    }
})

router.put('/new-password', async (req, res) => {
    const {password, token} = req.body;
    try {
        const user = await LocalUser.findOne({confirmToken: token});
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
              user.password = password;
              await user.save();
        res.status(200).send({msg: 'success'});
    }
    catch(err) {
        res.status(401).send({errors: err});
    }
})

// update user data

router.put('/user', ensureAuthenticated, async (req, res) => {
    const body = req.body;
    let user;
    try {
        if(req.body.userType === "local") {
            user = await LocalUser.findOne({_id: req.user._id});        
        } else {
            user = await User.findOne({_id: req.user._id});        
        }
        if(body.password && body.newPassword) {
                const ifUser = await bcrypt.compare(body.password, user.password);
                if(ifUser) {
                    user.password = body.newPassword;
                }
                else { 
                    throw new Error('Password is not correct')
                }
        }
        else if(body.username) {            
                user.username = body.username;
        }
        else if(body.email) {
                user.email = body.email;
                user.verified = false;
                const token = jwt.sign({ username: body.username },
                                        process.env.JWT_SECRET,
                                        { expiresIn: '24h' }).toString();
                    user.confirmToken = token;
        }
        await user.save();   
        if(body.email) {
            const host = req.get('host');
            const link = "http://" + host + "/auth/verify?token=" + user.confirmToken;
            const htmlMsg = "Please, click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>";            
            sendMail(user, htmlMsg, "verification");
        }        
        let userForSending;
        if(req.body.userType === "local") {
            userForSending = await LocalUser.findOne({_id: req.user._id}).select('-password');
        } else {
            userForSending = await User.findOne({_id: req.user._id}).select('-password');       
        }
        res.status(200).send({user: userForSending});
    }
    catch(err) {
            if(err.message.split("{")[0] === "E11000 duplicate key error collection: coujina.users index: username_1 dup key: ") {
                res.status(401).send({errors: 'Username is already in use'});
            }
            else if(err.message.split("{")[0] === "E11000 duplicate key error collection: coujina.users index: email_1 dup key: ") {
                res.status(401).send({errors: 'Email is already in use'});
            }
            else {
                res.status(401).send({errors: err.message});
            }
    }
})

// upload user profile photo

router.put('/upload-avatar', ensureAuthenticated, (req, res) => {
    multer(req, res, async (err) => {
        if (err) {
            res.status(400).send({ err: err.message });
        }
        const url = req.protocol + '://' + req.get('host');
        const imagePath = url + "/images/" + req.file.filename;
        const userType = req.body['userType'];
        let user;
        if(userType === 'local') {
            user = await LocalUser.findOne({_id: req.user._id})
                                  .populate('savedRecipes.recipe').select('-password');
        } else {
            user = await User.findOne({_id: req.user._id})
                             .populate('savedRecipes.recipe').select('-password');
        }
        user.imagePath = imagePath;
        await user.save();
        res.status(200).send({user: user});
    })
}, (err => res.status(400).send({ err: err.message })))

// delete user profile photo

router.delete('/avatar', ensureAuthenticated, async (req, res) => {
    const {userType} = req.body;
    let user;
    if(userType === 'local') {
        user = await LocalUser.findOne({_id: req.user._id})
                              .populate('savedRecipes.recipe').select('-password');
    } else {
        user = await User.findOne({_id: req.user._id})
                         .populate('savedRecipes.recipe').select('-password');
    }    
    const filePath = user.imagePath.split(req.protocol + '://' + req.get('host') + "/images/")[1];
    fs.unlink(`backend/images/${filePath}`, async (err) => {
        if (err) {
            throw new Error({message: "The image wasn't deleted. Try again"});
        }    
        console.log(`${filePath} was deleted`);
        user.imagePath = '';
        await user.save();
        res.status(200).send({user});
    });
}, (err => res.status(400).send({ err: err.message })))

module.exports = router;
