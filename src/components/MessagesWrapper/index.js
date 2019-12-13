import React, { memo, useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Message from '../Message';
import SocketContext from '../../context/SocketContext';
import style from './style.module.scss';

const MessagesWrapper = (props) => {
    const [messages, setMessages] = useState([]);
    const socket = useContext(SocketContext);
    const wrapperRef = useRef();
    const selectedUserRef = useRef();
    const { selectedUser, loggedUser } = props;

    useEffect(() => {
        scrollBottom();
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    
    useEffect(() => {
        const receiveMessage = ({ sender, receiver, createdAt, message }) => {           
            if ((get(selectedUserRef, 'current.id') === sender.id) || sender.id === get(loggedUser, 'id')) {
                scrollBottom();
                setMessages((messages) => [...messages, { sender, receiver, createdAt, message }]);
            }
        }

        const receiveMessagesHistory = (messagesList) => {
            setMessages(messagesList);
        }

        socket.on('receive_message', receiveMessage);
        socket.on('receive_messages_history', receiveMessagesHistory);
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    const scrollBottom = () => {
        setTimeout(() => {
            if (wrapperRef && wrapperRef.current) {
                wrapperRef.current.scrollTo({
                    top: wrapperRef.current.scrollHeight,
                    behavior: 'smooth',
                });
            }
        }, 150);
    }

    const renderMessages = () => {
        return messages.map((item) => (
            <Message
                key={item.createdAt}
                sender={item.sender}
                message={item.message}
                userID={get(loggedUser, 'id')}
            />
        ))
    }

    return (
        <div 
            className={style.wrapper}
            ref={wrapperRef}
        >
            {renderMessages()}
        </div>
    )
};

MessagesWrapper.propTypes = {
    selectedUser: PropTypes.object
};

export default memo(MessagesWrapper);