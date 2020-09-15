import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import {verifyUser, cleanErrors} from '../../actions/auth-actions';
import '../../styles/auth/Verification.scss';

const Verification = (props) => {
    const dispatch = useDispatch();
    const ifVerified = props.location.search.split(/[?=]/)[2];
    const errors = useSelector(state => state.auth.errors);
    const user = useSelector(state => state.auth.user);
    const [emailState, setEmailState] = useState('');
    
    const handleEmailChange = (e) => {
        const email = e.target.value;
        setEmailState(email);        
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(cleanErrors(''));
        dispatch(verifyUser(emailState));
        setEmailState('');
    }
    
    return ifVerified === 'failed' ? (
        <div className="verification-wrapper">
            The confirmation link has expired. 
            Enter your email to get a new link.
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input type="email" 
                           name="email" 
                           placeholder="Enter your email"
                           value={emailState}
                           onChange={handleEmailChange}
                           autoFocus 
                           required />                
                    <button type="submit">Send</button>
                </div>
            </form> 
            {errors && errors.length > 0 && <p>{errors[0]}</p>}
            {user && user.username && <p>The link has been sent successfully</p>}
        </div>
    ) : (
        <div className="verification-wrapper">
            Registration completed. You may <Link className="link link-success" to={'/login'}>login</Link>.
        </div>
    ) 
}

export default Verification;
