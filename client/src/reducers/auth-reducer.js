import { GET_USER, SIGNUP_USER, VERIFY_USER, LOGIN_USER, LOGOUT_USER, ERROR_USER } from '../actions/types';

const initialState = {
    user: {},
    isAuthenticated: false,
    errors: []
};

const clearLocalStorageOnLogout = () => {
    setTimeout(() => {
        localStorage.removeItem('username');
        localStorage.removeItem('id');
        localStorage.getItem('google') && localStorage.removeItem('google');
        localStorage.getItem('access') && localStorage.removeItem('access');
    }, 1000 * 60 * 60 * 3);
}

export default (state = initialState, action) => {
    switch(action.type) {
        case GET_USER: 
            action.payload.user && localStorage.setItem('username', action.payload.user.username);
            action.payload.user && action.payload.user.googleId ? localStorage.setItem('google', true) :
                                                                  localStorage.setItem('google', false);
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true
            }
        case SIGNUP_USER:
            return {
                ...state,
                user: action.payload
            }
        case LOGIN_USER:
            action.payload.user && localStorage.setItem('username', action.payload.user.username);
            action.payload.user && action.payload.user.googleId ? localStorage.setItem('google', true) :
                                                                  localStorage.setItem('google', false);
           
            localStorage.setItem('access', action.payload.user.admin ? 'admin' : 'auth');
            localStorage.setItem('id', action.payload.user._id);
            clearLocalStorageOnLogout();
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true
            } 
        case VERIFY_USER:
            return {
                ...state,
                user: action.payload.user
            }
        case LOGOUT_USER:
            localStorage.removeItem('username');
            localStorage.removeItem('id');
            localStorage.getItem('google') && localStorage.removeItem('google');
            localStorage.getItem('access') && localStorage.removeItem('access');
            return {
                ...state,
                user: {},
                isAuthenticated: false
            }           
        case ERROR_USER:
            let errors = [];
            if(action.payload && action.payload.errors && action.payload.errors.length > 0) {
                errors.push(action.payload.errors);
            }
            return {
                ...state,
                errors: [...errors],
                isAuthenticated: false
            }  
        default:
            return state;    
    }
}
