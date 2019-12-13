import React, { createContext, useState, memo } from 'react';

const UserContext = createContext(null);

export const UserProvider = memo((props) => {
    const userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).user : null;
    const [selectedUser, setSelectedUser] = useState(null);
    const [loggedUser, setLoggedUser] = useState(userData);

    return (
        <UserContext.Provider
            value={{
                selectedUser,
                loggedUser,
                setSelectedUser,
                setLoggedUser
            }}
        >
            { props.children }
        </UserContext.Provider>
    )
});

export default UserContext;