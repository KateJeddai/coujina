import { GET_NEW_RECIPES, 
         GET_RECIPES,
         GET_RECIPE, 
         ADD_RECIPE, 
         UPDATE_RECIPE,
         DELETE_RECIPE, 
         RECIPES_LOADING,
         POST_COMMENT,
         ERROR_RECIPES } from '../actions/types';

const initialState = {
    recipes: {couscous: [], tajine: [], marqat: [], soups: [], dough: []},
    recipesAll: [],
    recipe: {},
    loading: false,
    errors: [],
    count: 0,
    diff: {couscous: null, tajine: null, marqat: null, soups: null, dough: null},
    couscous: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case GET_NEW_RECIPES:
            return {
                ...state,
                recipesAll: action.payload.recipes,
                count: action.payload.count,
                loading: false
            };
        case GET_RECIPE:   
            return {
                ...state,
                recipe: action.payload,
                loading: false
            }
        case GET_RECIPES:
            return {
                ...state,
                recipes: {
                    ...state.recipes,
                    [action.payload.cat]: action.payload.recipes
                    },
                loading: false,
                count: action.payload.count,
                diff: {
                    ...state.diff,
                    [action.payload.cat]: action.payload.diff
                }
            }
        case ADD_RECIPE:
            return {
                ...state,
                recipes: {
                    ...state.recipes, 
                    [action.payload.cat]: [
                        ...state.recipes[action.payload.cat],
                        action.payload.recipe
                    ]                   
                }
            };
        case UPDATE_RECIPE:
            const cat = action.payload.category;
            return {
                ...state,
                recipe: action.payload,                    
                recipes: {
                    ...state.recipes,
                    [cat]: state.recipes[cat].map((rec) => {
                        if(action.payload._id === rec._id) {
                            return {
                                ...rec,
                                ...action.payload
                            }
                        }
                        else {
                            return rec;
                        }
                    })
                }
            }
        case DELETE_RECIPE:
            const category = action.payload.category;
            return {
                ...state,
                recipes: {
                    ...state.recipes,
                    [category]: state.recipes[category].filter(rec => rec._id !== action.payload._id)
                }
            }
        case RECIPES_LOADING:
            return {
                ...state,
                loading: true
            } 
        case POST_COMMENT:
            return {
                ...state,
                recipe: action.payload,
                loading: false
            }    
        case ERROR_RECIPES:
            let errors = [...state.errors];
            if(action.payload.length === 0) {
               errors = [];
            } else {
               errors.push(action.payload);
            }  
            return {
                ...state,
                errors: [...errors]
            }       
        default: 
            return state;    
    }
}