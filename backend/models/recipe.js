const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const RecipeSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        validate: {
            validator: function(v) {
                 return /^[a-zA-Z ]+$/.test(v)
            },
            message: 'A title must be a string!'
          }
    },
    category: {
        type: String,
        lowercase: true,
        required: true,
        validate: {
            validator: function(v) {
                 return /^[a-zA-Z ]+$/.test(v)
            },
            message: 'A category must be a string!'
          }
    }, 
    imagePath: {
        type: String,
        required: true
    },  
    ingredients: [{
            name: {
               type: String,
               required: true
            },
            quantity: {
                type: String,
                required: true  
            }    
    }],
    time: {
        prepTime: String,
        cookTime: String
    },
    description: String,
    date:  { 
        type: Date, 
        default: Date.now 
    },
    ranking: {
        total: {
            type: Number,
            default: 0
        },
        number: {
            type: Number,
            default: 0
        },
        rank: {
            type: Number,
            default: 0
        },
        rankUsers: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        rankLocalUsers: [{
            type: Schema.Types.ObjectId,
            ref: 'LocalUser'
        }]
    },
    comments: [{
            commentBody: {
                type: String,
                required: true
            },
            commentDate: {
                type: Date,
                default: Date.now()
            },
            commentUser: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            commentLocalUser: {
                type: Schema.Types.ObjectId,
                ref: 'LocalUser'
            }

    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }  
});

RecipeSchema.methods.countRanking = async function (rank, id) {
        const recipe = this;

        const total = recipe.ranking.total + rank;
        const number = recipe.ranking.number + 1;
        const rate = (total / number).toFixed(2);
        const rankUsers = recipe.ranking['rankUsers'];
        rankUsers.push(id);
        const ranking = { total, number, rank: rate, rankUsers };
              
        const updatedRecipe = await Recipe.findByIdAndUpdate({_id: recipe._id}, {ranking}, {new: true});
        return updatedRecipe;
}, err => {
    res.status(400).send({errors: "Something went wrong"})
}

RecipeSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = {Recipe};
