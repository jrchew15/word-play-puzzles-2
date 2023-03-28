import React, { SetStateAction, useEffect, Dispatch, MouseEventHandler } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/user';
import { loadWordgonSessions } from '../../store/wordgon';

const LogoutButton = (props: { loggingOut: boolean, setLoggingOut: Dispatch<SetStateAction<boolean>> }) => {
    const { loggingOut, setLoggingOut } = props;
    const dispatch = useDispatch();
    const onLogout: MouseEventHandler<HTMLLIElement> = async (e) => {
        setLoggingOut(true)
    };

    // prevents double logout
    useEffect(() => {
        if (loggingOut) {
            (async () => {
                await logout()(dispatch);
                await dispatch(loadWordgonSessions({}))
            })()
        }
    }, [loggingOut, dispatch])

    return <li onClick={onLogout} id='logout'>Logout</li>;
};

export default LogoutButton;
