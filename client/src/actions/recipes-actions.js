import { GET_RECIPES, 
         GET_RECIPE,
         GET_NEW_RECIPES,
         ADD_RECIPE, 
         UPDATE_RECIPE, 
         DELETE_RECIPE, 
         RECIPES_LOADING,
         ERROR_RECIPES, 
         POST_COMMENT} from './types';
import axios from 'axios';

export const getNewRecipes = (limit, startAt) => dispatch => {
    dispatch(setRecipesLoading());
    axios.get(`/recipes/new?limit=${limit}&start=${startAt}`)
         .then((res) => {
             return dispatch({
                 type: GET_NEW_RECIPES,
                 payload: res.data 
             })
         })
}

export const getRecipes = (cat, limit, start) => dispatch => {
    dispatch(setRecipesLoading());
    const url = `/recipes/${cat}?limit=${limit}&start=${start}`;
    axios.get(url)
         .then((res) => {
            return dispatch({
                type: GET_RECIPES,
                payload: {
                    recipes: res.data.recipes,
                    cat: res.data.cat,
                    count: res.data.count,
                    diff: res.data.diff
                }    
            })
         })
         .catch((err) => {
            return dispatch({
                type: ERROR_RECIPES,
                payload: err
            })
         })
}

export const getRecipe = (title) => dispatch => {
    dispatch(setRecipesLoading());
    axios.get(`/recipes/recipe/${title}`)
         .then((res) => {
             return dispatch({
                 type: GET_RECIPE,
                 payload: res.data.recipe
             })
         }) 
}

export const addRecipe = (recipe) => (dispatch, getState) => {
    const token = getState().auth.token;
    const config = {
        headers: {
            'content-type': 'multipart/form-data' 
        }
    };
    if(token) {
        config.headers['x-auth-token'] = token;
    }
    axios.post('/recipes', recipe, config)    
         .then((res) => {
             return dispatch({
                type: ADD_RECIPE,
                payload: {
                    cat: res.data.cat,
                    recipe: res.data.recipe 
                }
             })
         })
         .catch((err) => {
             return dispatch({
                type: ERROR_RECIPES,
                payload: err.response.data.err
            })
         })
}

export const cleanErrors = (errors) => ({
        type: ERROR_RECIPES,
        payload: [...errors]
})

export const updateRecipe = (id, recipe) => (dispatch, getState) => {
    const token = getState().auth.token;
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    if(token) {
        config.headers['x-auth-token'] = token;
    }
    axios.put(`/recipes/edit/${id}`, recipe, config)
         .then((res) => {
            return dispatch ({
                type: UPDATE_RECIPE,
                payload: res.data.recipe
            })  
         })
         .catch((err) => {
            return dispatch({
               type: ERROR_RECIPES,
               payload: err.response.data.err
           })
        })
}

export const updateRecipeRanking = (recipeName, rank) => (dispatch, getState) => {
    axios.put(`/recipes/edit/rank/${recipeName}`, {rank})
         .then((res) => {
            return dispatch ({
                type: UPDATE_RECIPE,
                payload: res.data.recipe
            })  
         })
         .catch((err) => {
            return dispatch({
               type: ERROR_RECIPES,
               payload: err.response.data.err
            })
        })
}

export const deleteRecipe = (id, cat) => (dispatch, getState) => {
    const token = getState().auth.token;
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    };
    if(token) {
        config.headers['x-auth-token'] = token;
    }
    axios.delete(`/recipes/delete/${id}`, config)
         .then((res) => {
             return dispatch({
                 type: DELETE_RECIPE,
                 payload: res.data.recipe
             })
         }) 
         .catch((err) => {
            return dispatch({
                type: ERROR_RECIPES,
                payload: err.response.data.err
            })
         })
}

export const postComment = (recName, comment) => (dispatch) => {
    axios.post(`/recipes/comment/${recName}`, comment)
         .then((res) => {
            return dispatch({
                type: POST_COMMENT,
                payload: res.data.recipe
            })
         })
         .catch((err) => {
            return dispatch({
                type: ERROR_RECIPES,
                payload: err.response.data.err
            })
         })
}

export const setRecipesLoading = () => ({
    type: RECIPES_LOADING
})
