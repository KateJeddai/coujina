import React, { useState, useEffect } from 'react'; 
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {updateUser, cleanErrors, logoutUser}  from '../../actions/auth-actions';
import '../../styles/auth/EditUser.scss';

const EditUser = (props) => {
    const user = useSelector(state => state.auth.user);
    const userType = localStorage.getItem('google') == "true" ? "google" : "local";
            
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');
    const [newPass, setNewPass] = useState('');    
    const [passTouched, setPassTouched] = useState(false);   
    const [errors, setErrors] = useState({
                                    username: null,
                                    email: null,
                                    password: null,
                                    newPassword: null 
                                });
    const [submitted, setSubmitted] = useState(false);
    const [dataSubmitted, setDataSubmitted] = useState(null);

    const dbErrors = useSelector(state => state.auth.errors);
    const userEmail = useSelector(state => state.auth.user.email);
    const dispatch = useDispatch();

    const [usernameInput, setUsernameInput] = useState(false);
    const [emailInput, setEmailInput] = useState(false);
    const [passwordInput, setPasswordInput] = useState(false);


    const handleUsernameInput = (e) => {
        e.preventDefault();        
        setUsernameInput(true);        
        setSubmitted(false);  
        if(dbErrors.length > 0) {
            dispatch(cleanErrors(''));
        }

        if(usernameInput && username.trim() !== '') {
            const user = {username, userType};
            dispatch(updateUser(user));         
            setUsernameInput(false);
            setSubmitted(true);
            setDataSubmitted('username');
        }
        else if(usernameInput && username.trim() === '') {
            setErrors({...errors, username: 'Enter a new username'})
        }
    }

    const handleCancelUsername = (e) => {
        e.preventDefault();        
        setUsernameInput(false);
        setUsername(user.username);
    }

    const handleEmailInput = (e) => {
        e.preventDefault();        
        setEmailInput(true);        
        setSubmitted(false);
        if(dbErrors.length > 0) {
            dispatch(cleanErrors(''));
        }

        if(emailInput && email.trim() !== '') {
            const user = {email, userType};
            dispatch(updateUser(user));         
            setEmailInput(false);
            setSubmitted(true);
            setDataSubmitted('email');
        }
        else if(emailInput && email.trim() === '') {
            setErrors({...errors, email: 'Enter a new email'})
        }
    }

    const handleCancelEmail = (e) => {
        e.preventDefault();        
        setEmailInput(false);
        setEmail(user.email);
    }

    const handlePasswordInput = (e) => {
        e.preventDefault();        
        setPasswordInput(true);        
        setSubmitted(false);
        if(dbErrors.length > 0) {
            dispatch(cleanErrors(''));
        }

        if(passwordInput && password.trim() !== '' && newPass.trim() !== '') {
            const user = {password, newPassword: newPass, userType};
            dispatch(updateUser(user));         
            setPasswordInput(false);
            setSubmitted(true);
            setDataSubmitted('password');
        }
        else if(passwordInput && password.trim() === '') {
            setErrors({...errors, password: 'Enter an old password'})
        }
        else if(passwordInput && newPass.trim() === '') {
            setErrors({...errors, newPassword: 'Enter a new password'})
        }
    }

    const handleCancelPassword = (e) => {
        e.preventDefault();        
        setPasswordInput(false);
        setPassword('');
    }

    useEffect(() => {
        return () => {
            dispatch(cleanErrors(''));
        }
    }, [dispatch]);
       
    const handleUsername = (e) => {
        setSubmitted(false);
        setUsername(e.target.value);
        errors.username = null;
        setErrors(errors);

        if(dbErrors.length > 0) {
            dispatch(cleanErrors(''));
        }
    }

    const handleEmail = (e) => {
        setSubmitted(false);
        setEmail(e.target.value);
        errors.email = null;
        setErrors(errors);

        if(dbErrors.length > 0) {
            dispatch(cleanErrors(''));
        }
    }    

    const handlePass = (e) => {
        setSubmitted(false);
        setPassword(e.target.value);
        errors.password = null;
        setErrors(errors);

        if(dbErrors.length > 0) {
            dispatch(cleanErrors(''));
        }
    }

    const handleNewPass = (e) => {
        setSubmitted(false);
        setNewPass(e.target.value);
        errors.newPassword = null;
        setErrors(errors);

        if(dbErrors.length > 0) {
            dispatch(cleanErrors(''));
        }
    }

    const handlePassFocus = (e) => {
        setPassTouched(true);
    }

    const handlePassBlur = (e) => {
        setPassTouched(false);
    }
    
    return (
        <div className="edit-user-wrapper">
           {submitted && dbErrors.length === 0 && <p className="success-message">Your changes have been successfully saved. </p>}
           {dataSubmitted === 'email' && <p className="success-message">Please check your email for a confirmation link</p>}
           <React.Fragment>
                <h3>Edit your personal data:</h3> 
                {dbErrors && dbErrors.length > 0 && <p>{dbErrors[0]}</p>}
                <form className="user-edit-form">        
                    <div className="user-edit-form-wrapper">
                        <div className="user-edit-form-inner">
                            {usernameInput && <div className="input-field">
                                <label>Username</label><br/>
                                <input type="text" 
                                    placeholder="Username" 
                                    name="username"
                                    value={username ? username : ''}
                                    autoFocus
                                    onChange={handleUsername} />
                                    {errors.username ? <p>{errors.username}</p> : <p></p>}
                            </div>}
                            {usernameInput && <button className="btn btn-cancel cancel-username" onClick={handleCancelUsername}>Cancel</button>}
                            <button className={!usernameInput ? "btn btn-show show-username" : "btn btn-show show-username active"} onClick={handleUsernameInput}>{!usernameInput ? 'Change username' : 'Submit changes'}</button>
                            <br/>
                            {emailInput && userType!== "google" && <div className="input-field">
                                <label>Email</label><br/>
                                <input type="text" 
                                    placeholder="Email" 
                                    name="email"
                                    value={email ? email : ''}
                                    onChange={handleEmail} />
                                    {errors.email && submitted ? <p>{errors.email}</p> : <p></p>}
                            </div>}
                            {emailInput && userType!== "google" && <button className="btn btn-cancel cancel-email" onClick={handleCancelEmail}>Cancel</button>}
                            { userType!== "google" && <button className={!emailInput ? "btn btn-show show-email" : "btn btn-show show-email active"} 
                                    onClick={handleEmailInput}>{!emailInput ? 'Change email' : 'Submit changes'}
                            </button> }
                        </div>
                        {userType!== "google" && <div className="user-edit-form-inner">
                            {passwordInput && <React.Fragment>
                                <div className="input-field">
                                    <label>Old password</label><br/>
                                    <input type="text" 
                                        placeholder="Old password" 
                                        name="old-password"
                                        onChange={handlePass}
                                        />
                                        {errors.password ? <p>{errors.password}</p> : <p></p>}
                                </div>
                                <div className="input-field">
                                    <label>New Password</label><br/>
                                    <input type="text" 
                                        placeholder="New password"
                                        name="confirmPassword"
                                        onChange={handleNewPass}                                  
                                        onFocus={handlePassFocus}
                                        onBlur={handlePassBlur} 
                                        />
                                        {errors.newPassword ? <p>{errors.newPassword}</p> : <p></p>}
                                        <div className={passTouched ? "tooltip tooltip_opened" : "tooltip"}>
                                            Eight or more characters, at least one uppercase, one lowercase, one special, and a number. 
                                        </div>
                                </div>
                            </React.Fragment>}     
                            {passwordInput && <button className="btn btn-cancel cancel-password" onClick={handleCancelPassword}>Cancel</button>}         
                            <button className={!passwordInput ? "btn btn-show show-password" : "btn btn-show show-password active"} onClick={handlePasswordInput}>{!passwordInput ? 'Change password' : 'Submit changes'}</button> 
                        </div>}
                    </div>
                </form>
            </React.Fragment>
        </div>
    )
}    

export default EditUser;
