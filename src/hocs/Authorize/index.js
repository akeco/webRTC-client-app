import React from 'react';
import { Redirect } from 'react-router-dom';

const Authorize = (Component) => (props) => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');

    if (!token || !userData) return <Redirect to='/login' />

    return (
        <Component {...props} />
    )
};

export default Authorize;