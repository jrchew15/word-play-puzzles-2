import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import LogoutButton from "./auth/LogoutButton";
import { useHistory, NavLink } from "react-router-dom";
import { appUseSelector, totalState } from '../store';
import { loadedUser } from '../classes/userTypes';
import { normalizedWordgonSessions } from '../classes/wordgonTypes';

// Dropdown menu displays a logout button, a profile view button, and all puzzles that user has begun
export default function UserDropdown(props: { setShowModal: Dispatch<SetStateAction<boolean>>, closeDropdowns: Function, setTriggerReload: Dispatch<SetStateAction<boolean>> }) {
    // need manual reload trigger to clear puzzle data when navigating between puzzles
    const currentUser = appUseSelector((state: totalState) => state.user) as loadedUser;
    const wordgons = appUseSelector((state: totalState) => state.wordgon) as normalizedWordgonSessions;
    const history = useHistory();

    const [loggingOut, setLoggingOut] = useState<boolean>(false);

    useEffect(() => {

        if (loggingOut) {
            history.push('/')
        }

    }, [loggingOut, history])

    return (currentUser && currentUser.id ?
        <ul id='user-dropdown' className="unselectable">
            <li onClick={() => { props.setShowModal(true); props.closeDropdowns() }}>My Profile</li>
            <div className="navbar-sep" />
            <LogoutButton loggingOut={loggingOut} setLoggingOut={setLoggingOut} />
            <div className="navbar-sep" />
            <li id='puzzle-select'>
                {currentUser.openSessions.length < 1 ? <span>No Open Wordgons</span> :
                    (<><span style={{ marginBottom: 4 }}>Open Wordgons</span>
                        {currentUser.openSessions.map(sesh => (
                            <span onClick={() => { props.closeDropdowns(); props.setTriggerReload(true) }} key={'wordgon' + sesh}>
                                <NavLink to={`/wordgons/${wordgons[sesh].puzzleId}`} >
                                    {wordgons[sesh].puzzleId}</NavLink>
                            </span>
                        ))}
                    </>)}
                {currentUser.openWordles.length < 1 ? <span>No Open Wordles</span> :
                    (<>
                        <span style={{ marginBottom: 4 }}>Open Wordles</span>
                        {currentUser.openWordles.map(wordleId => (
                            <span onClick={() => { props.closeDropdowns(); props.setTriggerReload(true) }} key={'wordle' + wordleId}>
                                <NavLink to={`/wordles/${wordleId}`} >
                                    {wordleId}
                                </NavLink>
                            </span>))}
                    </>
                    )}
            </li>
        </ul >
        : null)
}
