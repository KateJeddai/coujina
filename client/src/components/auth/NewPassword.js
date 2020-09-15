import React, {useState}  from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../../styles/auth/NewPassword.scss';
import PasswordMask from 'react-password-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const NewPassword = (props) => {
    const [submitted, setSubmitted] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [touched, setTouched] = useState(false);
    const [passError, setPassError] = useState('');
    const [confirmPassError, setConfirmPassError] = useState('');
    const token = props.location.search.split('=')[1];

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleChangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    }

    const handlePassBlur = () => {
        setTouched(false);
    }

    const handlePassFocus = () => {
        setTouched(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();        
        if(password.trim() === '') { 
            setPassError('Password is required');
        }
        else if(confirmPassword.trim() === '') {
            setConfirmPassError('Repeat the password');
        }
        else if(password !== confirmPassword) {
            setConfirmPassError('Passwords don\'t match');
        }
        else if(passError === '' && confirmPassError === '') {
            let data, method, url;        
                data = { password, token };
                url = '/auth/new-password';
                method = 'put';
            axios({method, url, data})
                .then((res) => {
                    setSubmitted(true);
                })
                .catch(err => console.log(err));
        }        
    }

    return !submitted ? (
            <div className="restore-form restore-pass">
                <form onSubmit={handleSubmit}>
                    <h3>Create a new password</h3>
                    <div className="input-group">
                        <PasswordMask
                            placeholder="Create a new password" 
                            value={password}
                            onChange={handleChangePassword}
                            onFocus={handlePassFocus}
                            onBlur={handlePassBlur}
                            required 
                            useVendorStyles={true}
                            buttonStyles={{backgroundColor: 'transparent'}}
                            showButtonContent={<FontAwesomeIcon icon={faEye} 
                                                                className="fontawesome"/>}
                            hideButtonContent={<FontAwesomeIcon icon={faEyeSlash} 
                                                                className="fontawesome"/>}
                            />
                            {passError && <p>{passError}</p>}      
                    </div>
                    <div className="input-group">
                        <PasswordMask
                            placeholder="Repeat the password" 
                            value={confirmPassword}
                            onChange={handleChangeConfirmPassword}
                            onFocus={handlePassFocus}
                            onBlur={handlePassBlur}
                            required 
                            useVendorStyles={true}
                            buttonStyles={{backgroundColor: 'transparent'}}
                            showButtonContent={<FontAwesomeIcon icon={faEye} 
                                                                className="fontawesome"/>}
                            hideButtonContent={<FontAwesomeIcon icon={faEyeSlash} 
                                                                className="fontawesome"/>}
                            />
                            {confirmPassError && <p>{confirmPassError}</p>}         
                    </div>
                    <div className={touched ? "tooltip tooltip_opened" : "tooltip"}>
                        Eight or more characters, at least one uppercase, one lowercase, one special, and a number
                    </div>
                    <button type="submit">Submit</button>
                </form>    
            </div>
        ) : (
            <div className="restore-form">
                <p>The password has been updated successfully. You may <Link to="/login" className="link-login">login.</Link></p>
            </div>
        )
}

export default NewPassword;
