const ensureAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    } else {
      res.redirect(`http://localhost:3000/login`);
    }
  }
  
const ensureAdmin = (req, res, next) => {
    if(req.isAuthenticated()) {
      if(req.user.admin) {
        return next();
      } else {
        res.redirect('http://localhost:3000/admin-login');
      }    
    } else {
      res.redirect('http://localhost:3000/admin-login');
    }
  }
  
module.exports = {ensureAuthenticated, ensureAdmin};

// const {User} = require('../models/user');
// const jwt = require('jsonwebtoken');

// const authenticate = (req, res, next) => {
//     const token = req.header('x-auth-token');
//     console.log(token);
//     if(!token) {
//         res.status(401).send({msg: 'Authorization denied'});
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     }
//     catch(err) {
//         res.status(400).send({errors: err.message});
//     }
// }

// module.exports = {authenticate};
