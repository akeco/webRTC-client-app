import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { unique } from 'lodash';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import addContact from '../../api/addContact';
import style from './style.module.scss';

const DropDownList = (props) => {
    const [addedContactsIDs, setAddedContactsIDs] = useState([]);
    const { searchedContacts, usersContacts, updateContactsList } = props;

    const onContactClick = async (id) => {
        try {
            const { data: { contact } } = await addContact(id);

            updateContactsList(contact);
            setAddedContactsIDs(unique([...addedContactsIDs, contact.id]));
        }
        catch (e) {
            //
        }
    }

    const renderAddButton = (id) => {
        const isIncluded = usersContacts.find((item) => item.id === id);
        
        if (!addedContactsIDs.includes(id) && !isIncluded) {
            return (
                <IconButton 
                    edge="end" 
                    aria-label="add"
                    onClick= {() => onContactClick(id)}
                >
                    <AddIcon />
                </IconButton>
            )
        }
    }

    const renderContacts = () => {
        return searchedContacts
        .map((item) => (
            <ListItem key={item.id}>
                <ListItemText primary={item.name} />
                <ListItemSecondaryAction>
                    { renderAddButton(item.id) }
                  </ListItemSecondaryAction>
            </ListItem>
        ))
    }

    if (!searchedContacts.length) return null;

    return (
        <div className={style.wrapper}>
            <List>
                { renderContacts() }
            </List>
        </div>
    )
}

DropDownList.propTypes = {
    searchedContacts: PropTypes.array.isRequired,
    usersContacts: PropTypes.array.isRequired,
    updateContactsList: PropTypes.func.isRequired
}

export default memo(DropDownList);