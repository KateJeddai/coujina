import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../../styles/auth/Restore.scss';

const RestoreAuth = (props) => {
    const user = props.location.user || (props.location.search.split(/[?&=]/)[4] === 'password' && {password: true});
    const [restoreResult, setRestoreResult] = useState(false);
    const [error, setError] = useState(null);
    const dbError = props.location.search.split(/[&?]/)[1];
        
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        
        let data, url, method;
        const email = e.target['email'].value;
              data = { email, user };
              url = '/auth/restore-credentials';
              method = 'post';
        axios({method, url, data})
             .then((res) => {
                 setRestoreResult(true);
             })
             .catch(err => {
                 if(err.message === "Request failed with status code 400") {
                    setError('User with such email doesn\'t exist');
                 }
             });
    }

    useEffect(() => {
        return () => {
            setRestoreResult(false);
        };
    }, [])
    
    return <React.Fragment>
        {!restoreResult || (restoreResult && error) ? (
            <div className="restore-form">
                { user && user.username && <h3>Your username will be sent to your email.</h3>}
                { user && user.password && <h3>A link to restore the password will be sent to your email.</h3>}
                {error && <p>{error}</p>}
                {dbError && dbError === "jwt=expired" && <p>The link to change your password has expired. <br/>
                                                            Enter your email to get a new one.</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="email" name="email" placeholder="Enter your email" autoFocus required />                
                        <button type="submit">Send</button>
                    </div>
                </form>    
            </div>
        ) : null} 
        {restoreResult && !error && (
            <div className="restore-form">  
                {user.username ? <h3>Your username has been sent to your email.</h3> : 
                                 <h3>A link to restore the password has been sent to your email.</h3>}
            </div>
        )}
        
    </React.Fragment>
} 

export default RestoreAuth;
