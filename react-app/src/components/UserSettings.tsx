import { useState, useEffect, FormEventHandler } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { appUseSelector, totalState } from "../store";
import { editUserThunk } from "../store/user";

import ImageDragAndDrop from "./auth/ImageDragAndDrop";
import './user.css'

export default function UserSettings() {
    const currentUser = appUseSelector((state: totalState) => state.user);

    const [errors, setErrors] = useState<string[]>([]);
    const [username, setUsername] = useState<string>(currentUser.username);
    const [email, setEmail] = useState<string>(currentUser.email as string);
    const history = useHistory();

    const [imageFile, setImageFile] = useState<null | File>(null);

    const dispatch = useDispatch();

    const submitUpdate: FormEventHandler = async (e) => {
        e.preventDefault();
        // dispatch returns null or an error array
        const data = await editUserThunk(currentUser.id, {
            username: username || currentUser.username,
            email: email || currentUser.email as string,
            image: imageFile || currentUser.profilePicture
        })(dispatch)

        if (data) {
            setErrors(data)
            return
        }
        history.push('/')
    }

    // load current profilePicture on render
    useEffect(() => {
        if (currentUser && currentUser.profilePicture) {
            fetch(currentUser.profilePicture)
                .then((res) => res.blob())
                .then((blob) => {
                    setImageFile(blob as File)
                })
                .catch((e) => { setErrors([e]) })
        }
    }, [currentUser])

    return (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2>User Settings</h2>
                <div style={{ display: 'flex' }}>
                    <form className="user-form" onSubmit={submitUpdate}>
                        <div className='errors-container'>
                            {errors.map((error, ind) => (
                                <div className='errors-container' key={ind}>{error}</div>
                            ))}
                        </div>
                        <div>
                            <label htmlFor="username">Username</label>
                            <input
                                type='text'
                                name='username'
                                placeholder={currentUser.username}
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                            ></input>
                            <label htmlFor="email">Email</label>
                            <input
                                type='text'
                                name='email'
                                placeholder={currentUser.email}
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            ></input>
                        </div>
                        <button className='modal-button' type='submit'>Confirm</button>
                    </form>
                </div>
            </div>
            <ImageDragAndDrop imageFile={imageFile} setImageFile={setImageFile} />
        </div>
    )
}
