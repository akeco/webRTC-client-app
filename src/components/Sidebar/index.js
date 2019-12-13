import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountIcon from '@material-ui/icons/AccountCircle';
import ContactsSearch from '../ContactsSearch';
import UserContext from '../../context/UserContext';
import SocketContext from '../../context/SocketContext';
import style from './style.module.scss';

const Sidebar = (props) => {
    const userContext = useContext(UserContext);
    const socket = useContext(SocketContext);
    const { contacts, updateContactsList, userData } = props;

    const onContactClick = (item) => {
        userContext.setSelectedUser(item);
        getContactSocketID(item.id);
        getMessagesHistory(item.id);
        setUsersRoom(item.id);
        leaveRoom(item.id);
    }

    const leaveRoom = (id) => {
        if (userContext.selectedUser && id && userContext.selectedUser.id !== id) {
            socket.emit('leave_chat_room', userContext.selectedUser.id);
        }
    }

    const getContactSocketID = (id) => {
        socket.emit('get_socket_id', id);
    }

    const setUsersRoom = (id) => {
        socket.emit('open_chat', id);
    }

    const getMessagesHistory = (id) => {
        socket.emit('get_messages_history', [id, get(userData, 'user.id') ]);
    }

    const onLogout = () => {
      localStorage.removeItem('userData');
      localStorage.removeItem('webRtcToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('contacts', contacts);
      props.history.replace('/login');
    }

    const renderContactsList = () => {
        if (!contacts.length) return (
            <p className={style.noContacts}>
                No contacts in the list<br/>
                Search and add new contacts
            </p>
        )

        return contacts.map((item) => (
            <ListItem 
                key={item.id}
                button
                onClick= {() => onContactClick(item)}
            >
                <ListItemIcon>
                    <AccountIcon />
                </ListItemIcon>
                <ListItemText primary={item.name} />
            </ListItem>
        ))
    }

    return (
        <div className={style.wrapper}>
            <div className={style.section}>
                <h4 className={style.title}>{userData.user.name}</h4>
                <p onClick={onLogout}>Sign out</p>
            </div>
            <ContactsSearch 
                usersContacts={contacts}
                updateContactsList={updateContactsList}
            />
            <div className={style.section}>
                <h4 className={style.title}>Contacts</h4>
                <List className={style.list}>
                    {renderContactsList()}
                </List>
            </div>
        </div>
    )
} 

Sidebar.propTypes = {
    contacts: PropTypes.array.isRequired,
    updateContactsList: PropTypes.func.isRequired,
    userData: PropTypes.object.isRequired
}

export default memo(withRouter(Sidebar));