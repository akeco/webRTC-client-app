import React, { Fragment, useEffect, useState } from 'react';
import { get, uniqBy } from 'lodash';
import Authorize from '../../hocs/Authorize';
import Sidebar from '../../components/Sidebar';
import ContentWrapper from '../../components/ContentWrapper';
import getContacts from '../../api/getContacts';

const MainPage = (props) => {
    const cachedContacts = localStorage.getItem('contacts') ? JSON.parse(localStorage.getItem('contacts')) : [];
    const [contacts, setContacts] = useState(cachedContacts);
    const userData = localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData'));

    useEffect(() => {
        (async () => {
            if (get(userData, 'user.id')) {
                try {
                    const { data: { contacts } } = await getContacts({ id: get(userData, 'user.id') });
                    setContacts(contacts);
                    localStorage.setItem('contacts', JSON.stringify(contacts));
                }
                catch (er) {
                    //
                }
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const updateContactsList = (contact) => setContacts((contacts) => uniqBy([...contacts, contact], 'id'));

    return (
        <Fragment>
            <Sidebar
                contacts={contacts}
                userData={userData}
                updateContactsList={updateContactsList}
            />
            <ContentWrapper
                contacts={contacts}
            />
        </Fragment>
    )
};

export default Authorize(MainPage);