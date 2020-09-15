import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import AppHeader from '../components/AppHeader';
import AppMain from '../components/AppMain';
import AppForm from '../components/admin/AppForm';
import AppEditRecipe from '../components/admin/AppEditRecipe';
import AppIndividualRecipe from '../components/AppIndividualRecipe';
import AppNewRecipesPage from '../components/AppNewRecipesPage';
import AppSearchRes from '../components/AppSearchRes';
import Signup from '../components/auth/Signup';
import Login from '../components/auth/Login';
import Verification from '../components/auth/Verification';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import AdminRoute from './AdminRoute';
import PrivateRoom from '../components/auth/PrivateRoom';
import store from '../store/store';
import {getUserData} from '../actions/auth-actions';
import RestoreAuth from '../components/auth/RestoreAuth';
import EditUser from '../components/auth/EditUser';
import NewPassword from '../components/auth/NewPassword';  

export const history = createBrowserHistory();
store.dispatch(getUserData());

const AppRouter = () => {
    return (
        <Router history={history}>
            <React.Fragment>
                <AppHeader  />
                <Switch>
                    <PublicRoute path="/" component={AppMain} exact={true} />                    
                    <PublicRoute path="/register" component={Signup} />  
                    <PublicRoute path="/login" component={(props) => <Login access="auth" {...props} />} />  
                    <PublicRoute path="/admin-login" component={(props) => <Login access="admin" {...props} />} />  
                    <PublicRoute path="/verification" component={Verification} />  
                    <PublicRoute path="/restore-credentials" component={RestoreAuth} />  
                    <PublicRoute path="/new-password" component={NewPassword} />  
                    <PrivateRoute path="/my-cabinet" component={PrivateRoom} exact={true} />   
                    <PrivateRoute path="/my-cabinet/edit" component={EditUser} />          
                    <PublicRoute path="/search" component={AppSearchRes} />
                    <AdminRoute path="/admin/form" component={AppForm} />
                    <AdminRoute path="/admin/edit/:category/:id" component={AppEditRecipe} />                       
                    <PublicRoute path="/:cat" component={AppNewRecipesPage}  exact={true} />   
                    <PublicRoute path="/:category/:recipe" component={AppIndividualRecipe} key={Math.random() * 5} />  
                    <Route path="*" render={() => (<Redirect to="/" />)} /> 
                </Switch>
            </React.Fragment>    
        </Router>
    )
}

export default AppRouter;
