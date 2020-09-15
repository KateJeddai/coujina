import React from 'react';
import '../styles/AppLoading.scss';

const AppLoading = () => (
    <div className="loader">
        <img className="loader-image" src="/spinner.gif" style={{width: '150px'}} alt="" />
    </div>
);    

export default AppLoading;