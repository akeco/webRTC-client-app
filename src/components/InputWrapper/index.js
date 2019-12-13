import React, { memo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import PhoneIcon from '@material-ui/icons/Phone';
import SocketContext from '../../context/SocketContext';
import style from './style.module.scss';

const InputWrapper = ({ selectedUser, disableCall, onAudioCall }) => {
    const [value, setValue] = useState('');
    const socket = useContext(SocketContext);
    const userData = localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData'));
    
    const onChange = (e) => {
        setValue(e.target.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        sendMessage();
        setValue('');
    }

    const sendMessage = () => {
        if (socket && socket.connected) {
            socket.emit('message', {
                receiver: selectedUser,
                sender: {
                    ...userData.user,
                    socketID: socket.id
                },
                message: value
            });
        }
    }

    return (
        <div className={style.wrapper}>
            <IconButton 
                className={style.callButton}
                disabled={disableCall}
                onClick={onAudioCall}
            >
                <PhoneIcon fontSize="inherit" />
            </IconButton>
            <form onSubmit={onSubmit}>
                <TextField
                    label="Message"
                    value={value}
                    onChange={onChange}
                    margin="normal"
                    variant="outlined"
                />
            </form>
        </div>
    )
};

InputWrapper.propTypes = {
    selectedUser: PropTypes.object,
    onAudioCall: PropTypes.func.isRequired,
    disableCall: PropTypes.bool.isRequired
}

export default memo(InputWrapper);