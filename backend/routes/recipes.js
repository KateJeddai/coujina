const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-storage');
const Filter = require('bad-words');
const {Recipe} = require('../models/recipe');
const {User} = require('../models/user');
const {LocalUser} = require('../models/localuser');
const {ensureAuthenticated} = require('../middleware/authenticate');

const filter_comment = new Filter();

// get searched recipes 

router.get('/', (req, res) => {
    const { search, ingredient, time } = req.query;
    let data;
    Recipe.find()
          .then((recipes) => {
              if(search) {
                 data = recipes.filter(rec => rec.title.toLowerCase().includes(search.toLowerCase()));
              } else if(ingredient) {
                  data = recipes.filter(rec => {
                      return rec.ingredients.find(ing => ing.name.toLowerCase() === ingredient.toLowerCase());
                 })
              } else if(time) {
                  let t = time.split('-');     
                  data = recipes.filter(rec => {
                      let prep = +rec.time.prepTime;
                      let cook = +rec.time.cookTime;
                      let prepcook = prep + cook;                         
                      if(prepcook <= t[1] && prepcook > t[0]) { 
                          return rec;
                      }
                  })
              }
                res.status(200).send({recipes: data});
           })
           .catch(err => {
                res.status(400).json({ err: err.message });
           })
})


// get new recipes

router.get('/new', (req, res) => {
    const limit = +req.query.limit;
    const start = +req.query.start - 1;
    let data;
    if(limit !== limit) {
        Recipe.find()
          .sort({ date: -1 })
          .then((recipes) => {
              res.status(200).send(recipes);
          })
    }
    else if(limit) {
        Recipe.find()
            .sort({ date: -1 })
            .skip(limit * start)
            .limit(limit)
            .then((recipes) => {
                data = recipes;
                return Recipe.find().countDocuments()
                             .then(count => {
                                res.status(200).send({
                                     recipes: data,
                                     count
                                })
                             })
            })
            .catch(err => {
                res.status(400).json({ err: err.message });
            })
    }
})

// get recipes by categories

router.get('/:cat', async (req, res) => {
    const cat = req.params.cat,
          limit = +req.query.limit,
          start = req.query.start - 1;
    let recipes, data, recipesAllInCategory, diff;      
        if(limit !== limit && start !== start) {
            recipes = Recipe.find({category: cat}); 
        }
        else if(limit === limit && start === start){
            const recipesToSkip = limit * start;            
            recipesAllInCategory = await Recipe.find({category: cat});
            diff = recipesAllInCategory.length - recipesToSkip;
           
                recipes = Recipe.find({category: cat}) 
                                .sort({ date: -1 })
                                .skip(recipesToSkip)
                                .limit(limit);
        }        
        recipes.then((recipes) => {
            data = recipes;
            return Recipe.find().countDocuments({category: cat})
                         .then(count => {
                            res.status(200).send({
                                recipes: data,
                                cat, count, diff
                            })
                         })
            })
            .catch(err => {
                res.status(400).send({ err: err.message });
            })    
})

// get individual recipe 

router.get('/recipe/:title', (req, res) => {
    Recipe.find({title: req.params.title})
          .populate('comments.commentUser')
          .populate('comments.commentLocalUser')
          .then((recipe) => {
              res.status(200).send({recipe: recipe[0]});
          })
          .catch(err => {
              res.status(400).json({ err: err.message });
          })
})

// post recipes

router.post('/', ensureAuthenticated, (req, res) => {
    multer(req, res, function (err) {
        if (err) {
            res.status(400).send({ err: err.message });
        }
        const body = req.body; 
        const url = req.protocol + '://' + req.get('host');
        const newRecipe = new Recipe({
            title: body.title,
            imagePath: url + "/images/" + req.file.filename,
            category: body.category,
            ingredients: JSON.parse(body.ingredients),
            time: JSON.parse(body.time),
            description: body.description,
            date: Date.now()
        });    
        newRecipe.save()
                .then((recipe) => {
                    res.status(200).send({
                        recipe,
                        cat: recipe.category
                    });
                })
                .catch(err => {
                    res.status(400).send({ err: err.message });
                })
    })          
})


// edit recipes

router.put('/edit/:id', ensureAuthenticated, (req, res) => {
    multer(req, res, function (err) {
        if (err) {
            res.status(400).send({ err: err.message });
        }
    const body = req.body;
    const id = req.params.id;
    const url = req.protocol + '://' + req.get('host');
    const newRecipe = {
        title: body.title,
        imagePath: typeof body.imagePath === 'string' ? body.imagePath : url + "/images/" + req.file.filename,
        category: body.category,
        ingredients: JSON.parse(body.ingredients),
        time: JSON.parse(body.time),
        description: body.description,
        date: Date.now()
    };
    Recipe.findOneAndUpdate({ _id: id }, newRecipe, {new: true})
          .then((recipe) => {
                res.status(200).send({recipe});
          })
          .catch(err => {                
                res.status(400).json({ err: err.message });
          })
    })      
})

// add ranking 

router.put('/edit/rank/:recipeName', ensureAuthenticated, async (req, res) => {
    const {rank} = req.body;
    const recipeName = req.params.recipeName;
    const id = req.user._id;
    try {
        const recipe = await Recipe.findOne({title: recipeName});  
        if(recipe.ranking.rankUsers.indexOf(id) >= 0) {
            throw new Error('You have already ranked the recipe');
        }
        const updatedRecipe = await recipe.countRanking(+rank, id);    
        res.send({recipe: updatedRecipe});
    }
    catch(err) {
        res.status(400).json({ err: err.message });
    }
})

router.delete('/delete/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    let recipe; 
    Recipe.findById({_id: id})
          .then((rec) => {
              recipe = rec;
              rec.remove()
                 .then(() => {
                     res.status(200).send({recipe})
                 })
          })
          .catch(err => {                
              res.status(400).json({ err: err.message });
          })
})

// post comment

router.post('/comment/:name', ensureAuthenticated, async (req, res) => {
    try {
        const recipe = await Recipe.findOne({title: req.params.name});
        const {userType, comment} = req.body;
        let newComment;
        newComment = userType === "local" ? {
            commentBody: filter_comment.clean(comment),
            commentLocalUser: req.user._id
        } : {
            commentBody: filter_comment.clean(comment),
            commentUser: req.user._id
        }
        recipe.comments.unshift(newComment);
        await recipe.save();

        const recipeWithComments = await Recipe.findOne({title: req.params.name})
                                               .populate('comments.commentUser')
                                               .populate('comments.commentLocalUser');
        
        console.log(recipeWithComments)
        res.status(200).send({recipe: recipeWithComments});
    }
    catch(err) {
        res.status(400).json({ err: err.message });
    }
})

// save recipe to private room

router.post('/save', ensureAuthenticated, async (req, res) => {
    const _id = req.user._id;
    const recipeId = req.body.recipeId;
    const userType = req.body.userType;
    try {
        let user;
        if(userType === 'google') {
            user = await User.findOne({_id});
        } else {
            user = await LocalUser.findOne({_id});
        } 
        const recipeData = {recipe: recipeId};
              user.savedRecipes.unshift(recipeData);
        const newUser = await user.save();
        res.send({user: newUser});
    }
    catch(err) {
        res.status(400).json({ err: err.message });
    }
})

// delete recipe from private room 

router.delete('/save', ensureAuthenticated, async (req, res) => {
    const _id = req.user._id;
    const recipeId = req.body.recipeId;
    const userType = req.body.userType;
    try {
        let user;
        if(userType === 'google') {
            user = await User.findOne({_id}).populate('savedRecipes.recipe');
        } else {
            user = await LocalUser.findOne({_id}).populate('savedRecipes.recipe');
        } 
        const filteredSavedRecipes = user.savedRecipes.filter(rec => rec.recipe._id != recipeId)
        user.savedRecipes = [...filteredSavedRecipes];
        const newUser = await user.save();
        res.send({user: newUser});
    }
    catch(err) {
        res.status(400).json({ err: err.message });
    }
})

module.exports = router;
