import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import recipes from '../reducers/recipes-reducer';
import filtersorted from '../reducers/filtersort-reducer';
import auth from '../reducers/auth-reducer';
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    combineReducers({
        recipes,
        filtersorted,
        auth
    }),
    composeEnhancers(applyMiddleware(thunk))
);

export default store;
