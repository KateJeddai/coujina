import React, {useState, useEffect} from 'react';
import {Link, Redirect, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser, cleanErrors} from '../../actions/auth-actions';
import axios from 'axios';
import PasswordMask from 'react-password-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
const queryString = require('query-string');


const Login = (props) => {    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userError, setUserError] = useState('');
    const [passError, setPassError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [redirectToReferrer, setRedirectToReferrer] = useState(false);
    const dispatch = useDispatch();
    
    const errors = useSelector(state => state.auth.errors); 
    const user = useSelector(state => state.auth.user && state.auth.user.username); 

    const { from } = props.location.state || { from: { pathname: '/' } };
    const verification = queryString.parse(props.location.search).verification === "success";    
    
    useEffect(() => {   
        if(errors.length === 0 && user) {
           setRedirectToReferrer(true);
        }
        else if(errors && errors.length > 0) {
            console.log('eerors', errors)
        }
        return () => {};
    }, [errors.length, user])

    useEffect(() => {
        return () => {
            dispatch(cleanErrors(''));
        }
    }, [dispatch]);
    
    const handleUsername = (e) => {
       const user = e.target.value;
       setSubmitted(false);
       setUserError('');
       if(errors.length > 0) {
          dispatch(cleanErrors(''));
       }
       setUsername(user);
    }

    const handlePassword = (e) => {
        const pass = e.target.value;
        setSubmitted(false);
        setPassError('');
        if(errors.length > 0) {
           dispatch(cleanErrors(''));
        }
        setPassword(pass);
    } 

    const handleSubmit = () => {
        setSubmitted(true);
        if(username.trim() === '') {
            setUserError('Username is required');
        }
        if(password.trim() === '') {
            setPassError('Password is required');
        }
        else if (userError.trim() === '' && passError.trim() === '') {
            const {access} = props;
            const data = {username: username, password: password, access};
            dispatch(loginUser(data))
            setUsername('');
            setPassword('');
        };
    }

    const handleKeyDown = (e) => {
        if(e.keyCode === 13) {
            handleSubmit();
        }
    } 

    if (redirectToReferrer === true) {
        return <Redirect to={from} />
    }

        return (
        <div className="form-wrapper">
            <h3>Login:</h3>
            { errors.length > 0 && errors[0] === "Email is not verified." && <p>{errors[0]} Check your email for a verification link.</p> }
            { errors.length > 0 && errors[0] === "Username or password is incorrect" && <React.Fragment>
                        <p>{errors[0]}</p>
                        <div className="links-fix-error-wrapper">
                            <Link className="link-fix-error" to={{
                                    pathname: '/restore-credentials',
                                    user: {
                                        username: true
                                    }
                            }}>Send me my username. </Link>
                            <Link className="link-fix-error" to={{
                                    pathname: '/restore-credentials',
                                    user: {
                                        password: true
                                    }
                            }}> Restore password.</Link>
                        </div>    
            </React.Fragment>} 
            { verification && <p>The email has been verified. You may login now.</p>}
            <form className="signup-form">        
                <div className="signup-form-wrapper">
                    <div className="signup-form-inner">
                        <div className="input-field">
                            <label>Username</label><br/>
                            <input type="text" 
                                placeholder="Enter username" 
                                value={username}
                                autoFocus
                                onChange={handleUsername} 
                                onKeyDown={handleKeyDown} />
                                {userError.length > 0 && submitted ? <p>{userError}</p> : <p></p>}
                        </div>
                        <div className="input-field">
                            <label>Password</label><br/>                           
                            <PasswordMask
                                name="password"
                                placeholder="Enter password" 
                                value={password}
                                onChange={handlePassword}
                                onKeyDown={handleKeyDown}
                                useVendorStyles={true}
                                buttonStyles={{backgroundColor: 'transparent'}}
                                showButtonContent={<FontAwesomeIcon icon={faEye} 
                                                                    className="fontawesome"/>}
                                hideButtonContent={<FontAwesomeIcon icon={faEyeSlash} 
                                                                    className="fontawesome"/>}
                                />
                                {passError.length > 0 && submitted ? <p>{passError}</p> : <p></p>}
                        </div>
                    </div>
                </div>
                <div className="no-account-div">No account? 
                     <Link to="register" className="no-account-link"> Signup now</Link>
                </div>
                <button className="btn btn-login" 
                        type="button"
                        onClick={handleSubmit}>Login
                </button>
                <div className="btn btn-login google-login">
                    <a href="/auth/google">Login with Google</a>            
                </div>
            </form>
        </div>
    )
}

export default Login;
