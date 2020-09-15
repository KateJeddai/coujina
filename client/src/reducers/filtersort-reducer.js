import { SEARCH_RECIPES, SEARCH_BY_INGREDIENT, SEARCH_BY_TIME } from '../actions/types';
import { RECIPES_LOADING } from '../actions/types';

const initialState = {
    searchRecipes: [],
    loading: false
};

export default (state = initialState, action) => {
    switch(action.type) {
        case SEARCH_RECIPES:
        case SEARCH_BY_INGREDIENT:   
        case SEARCH_BY_TIME:
                return {
                    ...state,
                    searchRecipes: action.payload,
                    loading: false
                }    
        case RECIPES_LOADING:    
                return {
                    ...state,
                    loading: true
                }     
        default: return state;    
    }
}
