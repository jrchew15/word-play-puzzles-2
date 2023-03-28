import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { appUseSelector, totalState } from '../store';
import { user } from '../classes/userTypes';

import { defaultImg } from '../utils/image_urls';
import './user.css'

// displays a user's profile picture, username, and total completed puzzles
function User(props: { userId: number | string, setShowModal: Dispatch<SetStateAction<boolean>> | undefined }) {
    // userId can come from url parameter or can be passed as prop
    const userId = useParams<{ userId: string }>().userId || props.userId;
    const [user, setUser] = useState<user | null>(null);
    const currentUser = appUseSelector((state: totalState) => state.user);
    const history = useHistory();

    // wait for userId, then fetch user
    useEffect(() => {
        if (!userId) return
        findUser(userId, setUser)
    }, [userId, setUser])

    function directToSettingsOnClick() {
        if (props.setShowModal !== undefined) {
            props.setShowModal(false)
        }
        history.push('/settings')
    }

    return !user ? null : (
        <div id='user-details'>
            <img src={user.profilePicture && typeof user.profilePicture === 'string' ? user.profilePicture : defaultImg} alt={user.username} onError={(e) => { e.currentTarget.src = defaultImg; console.log('image error') }} />
            <span style={{ fontSize: '1.5em' }}>{user.username}</span>
            <div id='user-puzzle-count'>
                <span style={{ display: 'flex' }}><p style={{ width: 'min-content' }}>Total Wordles Solved</p>
                    <span className='number-solved'>{user.totalWordles}</span>
                </span>
                <span style={{ display: 'flex' }}><p style={{ width: 'min-content' }}>Total Wordgons Solved</p>
                    <p className='number-solved'>{user.totalWordgons}</p>
                </span>
            </div>
            {currentUser.id === user.id && <button className='modal-button' onClick={directToSettingsOnClick}>
                Edit Settings
            </button>}
        </div>
    )
}
export default User;

async function findUser(userId: number | string, setUser: Dispatch<SetStateAction<user | null>>) {
    let res = await fetch(`/api/users/${userId}`);
    if (res.ok) {
        let found = await res.json();
        setUser(found);
    }
}
