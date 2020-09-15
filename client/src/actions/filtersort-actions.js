import { SEARCH_RECIPES, SEARCH_BY_INGREDIENT, RECIPES_LOADING, SEARCH_BY_TIME } from './types';
import axios from 'axios';

export const setRecipesLoading = () => ({
    type: RECIPES_LOADING
})

export const searchRecipes = (val) => dispatch => {
    dispatch(setRecipesLoading());
    axios.get(`/recipes/?search=${val}`)
         .then((res) => {
             return dispatch({
                 type: SEARCH_RECIPES,
                 payload: res.data.recipes 
             })
         })
}

export const searchRecipesByIngredient = (val) => dispatch => {
    dispatch(setRecipesLoading());
    axios.get(`/recipes/?ingredient=${val}`)
         .then((res) => {
             return dispatch({
                 type: SEARCH_BY_INGREDIENT,
                 payload: res.data.recipes 
             })
         })
}

export const searchRecipesByTime = (val) => dispatch => {
    dispatch(setRecipesLoading());
    axios.get(`/recipes/?time=${val}`)
         .then((res) => {
             return dispatch({
                 type: SEARCH_BY_TIME,
                 payload: res.data.recipes 
             })
         })
}
