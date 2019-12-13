import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import Fab from '@material-ui/core/Fab';
import PhoneIcon from '@material-ui/icons/Phone';
import style from './style.module.scss';

const dialogRoot = document.getElementById('portal');

const CallDialog = (props) => {
    const { open, selectedUserName, onHangup, callStatus, isIncomingCall, onAnswer } = props;

    if (!open) return null;

    const renderStatus = () => {
        if (callStatus === 'ringing') {
            return <small>Ringing...</small>
        }
        else if (callStatus === 'answer') {
            return <small>Answer...</small>
        }
    }

    const onClick = () => {
        if (isIncomingCall) {
            if (callStatus === 'answer') {
                onAnswer();
            }
            else {
                onHangup();
            }
        }
        else {
            onHangup();
        }
    }

    return (
        createPortal(
            <div className={style.wrapper}>
                <div className={style.topBlock}>
                    <p>{ selectedUserName }</p>
                    { renderStatus() }
                </div>
                <div className={style.bottomBlock}>
                    <Fab 
                        aria-label="phone"
                        className={classNames({
                            [style.incoming]: isIncomingCall && callStatus === 'answer'
                        })}
                        onClick={onClick}
                    >
                        <PhoneIcon fontSize="large" />
                    </Fab>
                </div>
            </div>,
            dialogRoot
        )
    )
};

CallDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    callStatus: PropTypes.string,
    selectedUserName: PropTypes.string,
    isIncomingCall: PropTypes.bool.isRequired,
    onAnswer: PropTypes.func.isRequired,
    onHangup: PropTypes.func.isRequired
}

export default memo(CallDialog);

