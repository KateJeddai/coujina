import React from 'react';
import {connect} from 'react-redux';
import {Route, Redirect} from 'react-router-dom';

const PrivateRoute = ({authenticated, component: Component, ...rest}) => {
    return (
        <Route {...rest} component={(props) => (
            authenticated ? (
                <Component {...props} />
            ) : (
                <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                  }} />
            )
        )} />
    )
}

const mapStateToProps = (state) => ({
    authenticated: state.auth.user.username
})

export default connect(mapStateToProps)(PrivateRoute);
