import React, { createContext, useEffect, useState, memo, useContext, useRef } from 'react';
import io from 'socket.io-client';
import UserContext from './UserContext';

const SocketContext = createContext(null);

export const SocketProvider = memo((props) => {
    const [socket, setSocket] = useState({});
    const userContext = useContext(UserContext);
    const userContextRef = useRef();

    const setConnection = () => {
        if (userContext.loggedUser && !Object.keys(socket).length) {
            const sock = io('https://infobip-socket.herokuapp.com', { query:`id=${userContext.loggedUser.id}` });

            sock.on('connect', () => {
                setSocket(sock);
            });

            sock.on('receive_contact_socket', (data) => {
                if (data) {
                    userContext.setSelectedUser((selectedUser) => ({ ...selectedUser, socketID: data.socketID }));
                }
            });

            sock.on('changed_socket_id', changeSelectedUserSocketID);
        }
    }

    useEffect(() => {
        setConnection();
        userContextRef.current = userContext.selectedUser;
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userContext]);

    const changeSelectedUserSocketID = ({ userID, socketID }) => {
        if (userID && userContextRef.current.id === userID) {
            userContext.setSelectedUser({ ...userContextRef.current, socketID });
        }
    }
    
    return (
        <SocketContext.Provider
            value={socket}
        >
            { props.children }
        </SocketContext.Provider>
    )
});

export default SocketContext;