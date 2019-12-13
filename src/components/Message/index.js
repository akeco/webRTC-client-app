import React, { memo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import style from './style.module.scss';

const Message = ({ message, sender, userID }) => {
    return (
        <div 
            className={classNames(style.wrapper, {
                [style.pushRight]: userID === sender.id
            })}
        >
            <div>
                { userID !== sender.id && <h4>{sender.name}</h4> }
                <p>{message}</p>
            </div>
        </div>
    )
};

Message.propTypes = {
    sender: PropTypes.object.isRequired,
    message: PropTypes.string.isRequired,
    userID: PropTypes.string,
}

export default memo(Message);