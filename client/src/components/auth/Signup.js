import React, { Component } from 'react';
import {connect} from 'react-redux';
import { signupUser, cleanErrors } from '../../actions/auth-actions';
import AppModal from '../admin/AppModal';
import {verifyUser} from '../../actions/auth-actions';
import '../../styles/auth/Login.scss';
import PasswordMask from 'react-password-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';


class Signup extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '', 
        passTouched: false,       
        errors: {
            username: null,
            email: null,
            password: null,
            confirmPassword: null 
        },
        dbErrors: [],
        submitted: false,
        registered: false,
        verificationResent: false 
    }
    
    handleUsername = (e) => {
        const username = e.target.value;
        this.setState((prevState) => ({
            username,
            submitted: false,
            errors: {
                ...prevState.errors,
                username: null
            }
        }));
    }
    handleEmail = (e) => {
        const email = e.target.value;
        this.setState((prevState) => ({
            email,
            submitted: false,
            errors: {
                ...prevState.errors,
                email: null
            }
        }));
    }
    handlePassFocus = () => {
        this.setState(() => ({
            passTouched: true
        }))
    }
    handlePassBlur = () => {
        this.setState(() => ({
            passTouched: false
        }))
    }
    handlePass = (e) => {
        const password = e.target.value;
        this.setState((prevState) => ({
            password,
            submitted: false,
            errors: {
                ...prevState.errors,
                password: null,
                confirmPassword: null
            }
        }));
    }
    handleConfirmPass = (e) => {
        const confirmPassword = e.target.value;
        this.setState((prevState) => ({
            confirmPassword,
            submitted: false,
            errors: {
                ...prevState.errors,
                confirmPassword: null
            }
        }));
    }

    handleModal = (modalClosed) => {
        if(modalClosed) {
            this.setState(() => ({
                dbErrors: [],
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
            }));
            this.props.cleanErrors('');
        }
    }

    handleSubmit = () => {                           
        this.setState(() => ({
            submitted: true
        }));
        const {username, email, password, confirmPassword} = this.state;
        let errors = {...this.state.errors}; 
        if(!username || username.trim() === '') {
            errors.username = 'Username is required';
        }
        if(!email || email.trim() === '') {
            errors.email = 'Email is required';
        }
        if(!password || password.trim() === '') {
            errors.password = 'Password is required';
        }   
        if(password !== confirmPassword) {
            errors.confirmPassword = 'The passwords don\'t match';
        }
               
        else if(!errors.username && !errors.email && !errors.password && !errors.confirmPassword) {
            const user = {
                username, email, password
            };       
            this.props.signupUser(user); 
            this.setState(() => ({
                registered: true
            }))
        }
        this.setState(() => ({
            errors
        }))  
    }

    handleKeyDown = (e) => {
        if(e.keyCode === 13) {
            this.handleSubmit();
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.dbErrors !== this.props.dbErrors) {
            const dbErrors = [...this.state.dbErrors];
            if(this.props.dbErrors.length > 0) {
                dbErrors.push(this.props.dbErrors);
            }            
            this.setState(() => ({
                dbErrors
            }))
        }
    }

    sendVerificationRequest = () => {
        this.props.verifyUser(this.props.user.email);
        this.setState(() => ({
            verificationResent: true
        }))
    }

    render() {
        const {errors, submitted, registered, dbErrors, verificationResent} = this.state;
        const {user} = this.props;
        return (
            <div className="form-wrapper">
                {dbErrors.length > 0 ? <AppModal errors={dbErrors} handleModal={this.handleModal}/> : null}
                {registered && user && user.username && !user.verified && 
                    (<p>Please, check your email for a verification link.
                        If you didn't get an email, 
                        click <span className="span-link"
                                    onClick={this.sendVerificationRequest}>here.</span></p>)} 
                {verificationResent && <p>Verification link has been sent.</p>}
                {!registered && (                    
                    <React.Fragment>
                        <h3>Create an account:</h3> 
                        <form className="signup-form">        
                            <div className="signup-form-wrapper">
                                <div className="signup-form-inner">
                                    <div className="input-field">
                                        <label>Username</label><br/>
                                        <input type="text" 
                                            placeholder="Create a username" 
                                            className="form-control"
                                            name="username"
                                            value={this.state.username}
                                            autoFocus
                                            onChange={this.handleUsername} />
                                            {errors.username && submitted ? <p>Username is required</p> : <p></p>}
                                    </div>
                                    <div className="input-field">
                                        <label>Email</label><br/>
                                        <input type="text" 
                                            placeholder="Enter an email" 
                                            className="form-control" 
                                            name="email"
                                            value={this.state.email}
                                            onChange={this.handleEmail} />
                                            {errors.email && submitted ? <p>Email is required</p> : <p></p>}
                                    </div>
                                </div>
                                <div className="signup-form-inner">
                                    <div className="input-field">
                                        <label>Password</label><br/>
                                        <PasswordMask
                                            placeholder="Enter a password" 
                                            value={this.state.password}
                                            onChange={this.handlePass} 
                                            onFocus={this.handlePassFocus}
                                            onBlur={this.handlePassBlur}
                                            useVendorStyles={true}
                                            buttonStyles={{backgroundColor: 'transparent'}}
                                            showButtonContent={<FontAwesomeIcon icon={faEye} 
                                                                                className="fontawesome"/>}
                                            hideButtonContent={<FontAwesomeIcon icon={faEyeSlash} 
                                                                                className="fontawesome"/>}
                                            />
                                            {errors.password && submitted ? <p>Password is required</p> : <p></p>}
                                        <div className={this.state.passTouched ? "tooltip tooltip_opened" : "tooltip"}>
                                            Eight or more characters, at least one uppercase, one lowercase, one special, and a number
                                        </div>
                                    </div>
                                    <div className="input-field">
                                        <label>Confirm Password</label><br/>
                                        <PasswordMask
                                            placeholder="Confirm password" 
                                            value={this.state.confirmPassword}
                                            onChange={this.handleConfirmPass} 
                                            useVendorStyles={true}
                                            buttonStyles={{backgroundColor: 'transparent'}}
                                            showButtonContent={<FontAwesomeIcon icon={faEye} 
                                                                                className="fontawesome"/>}
                                            hideButtonContent={<FontAwesomeIcon icon={faEyeSlash} 
                                                                                className="fontawesome"/>}
                                            />
                                            {errors.confirmPassword && submitted ? <p>Passwords don't match</p> : <p></p>}
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-signup" 
                                    type="button" 
                                    onClick={this.handleSubmit}>Sign Up
                            </button>
                        </form>
                    </React.Fragment>)}                    
            </div>
        )
    }
    
}

const mapStateToProps = (state) => ({    
        dbErrors: state.auth.errors,
        user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({
    signupUser: (user) => dispatch(signupUser(user)),
    verifyUser: (email) => dispatch(verifyUser(email)),
    cleanErrors: (errors) => dispatch(cleanErrors(errors))
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
