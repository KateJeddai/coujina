import React, {useEffect} from 'react';
import { Link, withRouter } from 'react-router-dom';
import {logoutUser} from '../actions/auth-actions';
import {useSelector, useDispatch} from 'react-redux';
import '../styles/AppSidebar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const AppSidebar = (props) => {
    const {navbarCollapsed} = props;
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const username = useSelector(state => state.auth.user.username);
    const dispatch = useDispatch();
    const location = props.location.pathname;

    useEffect(() => {
        props.handleNavbarCollapsedFalse(false);
        return () => {}
    }, [location, isAuthenticated])

    const handleLogout = () => {
        dispatch(logoutUser());
    }

    const handleNavbarCollapsed = (e) => {
        e.preventDefault();
        props.handleNavbarCollapsedFalse(false);
    }

    return (
        <div className={navbarCollapsed ? "sidebar-wrapper open" : "sidebar-wrapper closed"}>
            <div className="sidebar-inner">
                <div className="navbar">
                    <div className="nav-item-wrapper">
                        <Link to="/couscous" className="nav-item main">Couscous</Link>
                    </div>
                    <div className="nav-item-wrapper">
                        <Link to="/tajine" className="nav-item main">Tajine</Link>
                    </div>
                    <div className="nav-item-wrapper">    
                        <Link to="/marqat" className="nav-item main">Marqat</Link>
                    </div>
                    <div className="nav-item-wrapper">
                        <Link to="/soups" className="nav-item main">Soups and Salads</Link>
                    </div>
                    <div className="nav-item-wrapper">
                        <Link to="/dough" className="nav-item main">Dough and Sweets</Link>
                    </div>
                </div>
                <div className="line-divide"></div>
                <div className="auth-wrapper">
                    <FontAwesomeIcon icon={faTimes} className="fontawesome" onClick={handleNavbarCollapsed} />
                    <div className="auth-navbar">
                        { isAuthenticated ? (
                        <div className="auth-links">                        
                            <div className="link-wrapper"><Link to="/my-cabinet" className="nav-item auth">{username}</Link></div>
                            <div className="link-wrapper"><Link to="#" className="nav-item auth" onClick={handleLogout}>Logout</Link></div>
                        </div>
                        ) : (
                        <div className="auth-links">
                            <div className="link-wrapper"><Link to="/register" className="nav-item auth">Signup</Link></div>
                            <div className="link-wrapper"><Link to="/login" className="nav-item auth">Login</Link></div>
                        </div>
                        )}
                    </div> 
                </div>
            </div>            
        </div>
    )
}

export default withRouter(AppSidebar);
