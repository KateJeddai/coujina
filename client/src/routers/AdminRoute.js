import React from 'react';
import {connect} from 'react-redux';
import {Route, Redirect} from 'react-router-dom';

const AdminRoute = ({authenticated, access, component: Component, ...rest}) => {
    return (
        <Route {...rest} component={(props) => {
            return access === 'admin' ? (
                <Component {...props} />
            ) : (
                <Redirect to='/'/>
            )
        }} />
    )
}

const mapStateToProps = (state) => ({
    authenticated: state.auth.user.username,
    access: localStorage.getItem('access')
})

export default connect(mapStateToProps)(AdminRoute);
