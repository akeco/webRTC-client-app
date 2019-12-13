import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import DropDownList from '../DropdownList';
import getContacts from '../../api/getContacts';
import style from './style.module.scss';

const ContactsSearch = props => {
    const [searchText, setSearchText] = useState('');
    const [searchedContacts, setSearchedContacts] = useState([]);
    const { usersContacts, updateContactsList } = props;

    useEffect(() => {
        (async () => {
            if (searchText) {
                const { data: { contacts } } = await getContacts({ name: searchText });
                setSearchedContacts(contacts);
            }
            else {
                setSearchedContacts([]);
            }
        })()
    }, [searchText]);

    const onChange = (e) => setSearchText(e.target.value);

    const onClearSearch = () => {
        setSearchText('');
    }

    return (
        <div className={style.wrapper}>
            <input 
                type="text"
                placeholder="Search contacts..."
                value={searchText}
                onChange={onChange}
            />
            {
                searchText && (
                    <CloseIcon 
                        fontSize="small"
                        className={style.close}
                        onClick={onClearSearch}
                    />
                )
            }
            <DropDownList 
                searchedContacts={searchedContacts}
                usersContacts={usersContacts}
                updateContactsList={updateContactsList}
            />
        </div>
    )
};

ContactsSearch.propTypes = {
    usersContacts: PropTypes.array.isRequired,
    updateContactsList: PropTypes.func.isRequired
}

export default memo(ContactsSearch);