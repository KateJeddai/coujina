import { GET_USER, SIGNUP_USER, VERIFY_USER, LOGIN_USER, LOGOUT_USER, ERROR_USER } from './types';
import axios from 'axios';

export const signupUser = (user) => dispatch => {
    axios.post('/auth/users', user)
         .then(res => {
             return dispatch({
                type: SIGNUP_USER,
                payload: res.data.user
             })
         })
         .catch(err => {
             return dispatch({
                type: ERROR_USER,
                payload: err.response.data
            })
        })
}

export const verifyUser = (email) => dispatch => {
    axios.get(`/auth/resend-verification?email=${email}`)
             .then((res) => {
                 return dispatch({
                    type: VERIFY_USER,
                    payload: res.data
                 })
             })
             .catch(err => {
                return dispatch({
                    type: ERROR_USER,
                    payload: err.response.data
                })
           })
}

export const getUserData = () => (dispatch) => {
    axios.get(`/auth/user`)
         .then(res => {
             return dispatch({
                 type: GET_USER,
                 payload: res.data
             })
         })
         .catch(err => {
            return dispatch({
               type: ERROR_USER,
               payload: err.response && err.response.data
           })
       })
}

export const loginUser = (data) => dispatch => {
    axios.post('/auth/login', data)
         .then(res => {
             return dispatch({
                 type: LOGIN_USER,
                 payload: res.data
             })
         })
         .catch(err => { 
            return dispatch({
               type: ERROR_USER,
               payload: err.response && err.response.data
           })
       })
}

export const updateUser = (user) => (dispatch) => {
    axios.put(`/auth/user`, user)
        .then(res => {
            return dispatch({
                    type: GET_USER,
                    payload: res.data
            }) 
        })
        .catch(err => {
            return dispatch({
                type: ERROR_USER,
                payload: err.response.data
            })
        }) 
}

export const uploadUserPhoto = (data) => (dispatch, getState) => {
    axios.put(`/auth/upload-avatar`, data)
        .then(res => {
            return dispatch({
                type: GET_USER,
                payload: res.data
            })
        })
        .catch(err => {
            return dispatch({
                type: ERROR_USER,
                payload: err.response.data
            })
        })
}

export const deleteUserPhoto = (data) => (dispatch, getState) => {
    axios.delete(`/auth/avatar`, {data})
        .then(res => {
            return dispatch({
                type: GET_USER,
                payload: res.data
            })
        })
        .catch(err => {
        return dispatch({
            type: ERROR_USER,
            payload: err.response.data
        })
    })
}

export const saveRecipeForUser = (data) => (dispatch) => {
    axios.post('/recipes/save', data)
        .then(res => {
            return dispatch({
                    type: GET_USER,
                    payload: res.data
            })
        })
        .catch(err => {
            return dispatch({
                    type: ERROR_USER,
                    payload: err.response.data
                })
        });
}

export const deleteUserSavedRecipe = (data) => (dispatch) => {
    axios.delete('/recipes/save', {data})
        .then(res => {
            return dispatch({
                    type: GET_USER,
                    payload: res.data
                })
        })
        .catch(err => {
            return dispatch({
                    type: ERROR_USER,
                    payload: err.response.data
                })
        });
}

export const logoutUser = () => (dispatch) => {
    return dispatch({
        type: LOGOUT_USER
    })
}

export const cleanErrors = (errors) => {
    return {
        type: ERROR_USER,
        payload: {
            errors
        }
    } 
}
