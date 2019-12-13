import React, { memo, useContext, useState, useRef, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import InputWrapper from '../InputWrapper';
import MessagesWrapper from '../MessagesWrapper';
import UserContext from '../../context/UserContext';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CallDialog from '../CallDialog';
import { InfobipRTC } from "infobip-rtc";
import axios from 'axios';
import style from './style.module.scss';

const ContentWrapper = ({ contacts }) => {
    const userContext = useContext(UserContext);
    const [isIncomingCall, setIsIncomingCall] = useState(false);
    const [infobipRTC, setInfobipRTC] = useState(null);
    const [outgoingCall, setOutgoingCall] = useState(null);
    const [openCallDialog, setOpenCallDialog] = useState(false);
    const [callStatus, setCallStatus] = useState(null);
    const [incomingCall, setIncomingCall] = useState(false);
    const [incomingCaller, setIncomingCaller] = useState(null);
    const contactsRef = useRef();

    useEffect(() => {
        contactsRef.current = contacts;
    }, [contacts]);

    useEffect(() => {
        const getWebRtcToken = async () => {
            const userData = localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData'));
            const cachedWebRtcToken = localStorage.getItem('webRtcToken') && JSON.parse(localStorage.getItem('webRtcToken'));

            if (cachedWebRtcToken && new Date() < new Date(cachedWebRtcToken.expirationTime)) return ({ data: cachedWebRtcToken });

            return axios.post('https://5v816x.api.infobip.com/webrtc/1/token', {
                identity: userData.user.id,
                displayName: userData.user.name
            }, {
                headers: {
                    Authorization: `Basic ${ window.btoa('WebRTCTest:@G?k.p&z[u8Wzq6Z') }`,
                    'Content-Type': 'application/json',
                }
            });
        }

        (async () => {
            try {
                const { data } = await getWebRtcToken();
            
                localStorage.setItem('webRtcToken', JSON.stringify(data));
                setWebRtcConnection(data);
            }
            catch (e) {
                console.log("ERR", e);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (outgoingCall) {
            outgoingCall.on('ringing', (event) => {
                if (!openCallDialog) setOpenCallDialog(true);
                setCallStatus('ringing');
            });

            outgoingCall.on('established', (event) => {
                setCallStatus('established');
                document.querySelector("#audioElement").srcObject = event.remoteStream;
            });

            outgoingCall.on('hangup', onHangup);

            outgoingCall.on('error', onHangup);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outgoingCall]);

    const setWebRtcConnection = (data) => {
        const options = { debug: true };
        const infobipRTC = new InfobipRTC(data.token, options);

        setInfobipRTC(infobipRTC);

        infobipRTC.on('incoming-call', (incomingCall) => {
            setIsIncomingCall(true);
            setOpenCallDialog(true);
            setCallStatus('answer');
            setIncomingCall(incomingCall);
            setIncomingCaller(contactsRef.current.find((item) => item.id === incomingCall.source().identity));
            
            incomingCall.on('established', () => {
                setCallStatus(null);
            });

            incomingCall.on('hangup', onHangup);
        });

        infobipRTC.on('connected', (event) => {
            console.log('Connected with identity: ' + event.identity);
        });

        infobipRTC.on('disconnected', (event) => {
            console.log('Disconnected!');
        });

        infobipRTC.connect();
    }

    const onAnswer = () => {
        if (incomingCall) {
            incomingCall.accept();
        }
    }

    const onHangup = () => {
        if (incomingCall) {
            incomingCall.hangup();
            setIncomingCall(null);
        }
        if (outgoingCall) {
            outgoingCall.hangup();
            setOutgoingCall(null);
        }
        setOpenCallDialog(false);
    }

    const onAudioCall = () => {
        if (infobipRTC) {
            if (!openCallDialog) setOpenCallDialog(true);
            setOutgoingCall(infobipRTC.call(userContext.selectedUser.id));
        }
    }

    const renderContentElements = () => {
        if (!userContext.selectedUser) {
            return (
                <div className={style.blankScreen}>
                    <p>Select user to start chating!</p>
                </div>
            )
        }
        else {
            return (
                <Fragment>
                    <Header selectedUser={userContext.selectedUser} />
                    <MessagesWrapper 
                        selectedUser={userContext.selectedUser} 
                        loggedUser={userContext.loggedUser}
                    />
                    <InputWrapper 
                        selectedUser={userContext.selectedUser}
                        onAudioCall={onAudioCall}
                        disableCall={!!outgoingCall}
                    />
                </Fragment>
            )
        }
    }
    
    return (
        <div className={style.wrapper}>
           {
               renderContentElements()
           }
            <audio id="audioElement" autoPlay />
            {
                openCallDialog && <div className={style.darkLayer}></div>
            }
            <CallDialog 
                open={openCallDialog}
                callStatus={callStatus}
                isIncomingCall={isIncomingCall}
                selectedUserName={(incomingCaller && incomingCaller.name) || get(userContext, 'selectedUser.name')}
                onHangup={onHangup}
                onAnswer={onAnswer}
            />
        </div>
    )
};

const Header = memo(({ selectedUser }) => {
    return (
        <div className={style.header}>
            <AccountCircleIcon />
            <p>{ selectedUser.name }</p>
        </div>
    )
});

ContentWrapper.propTypes = {
    contacts: PropTypes.array.isRequired
}

Header.propTypes = {
    selectedUser: PropTypes.shape({
        name: PropTypes.string.isRequired
    }).isRequired
}

export default memo(ContentWrapper);