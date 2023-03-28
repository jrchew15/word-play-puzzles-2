import React, { ChangeEvent, ChangeEventHandler, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux'
import { Redirect, NavLink } from 'react-router-dom';
import { signUp } from '../../store/user';
import { appUseSelector, totalState } from "../../store";
import { user } from '../../classes/userTypes';
import ImageDragAndDrop from './ImageDragAndDrop';

import './dragDrop.css'

const SignUpForm = () => {
    const theme = 'light';

    const [errors, setErrors] = useState<string[]>([]);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState<string>('');

    const [imageFile, setImageFile] = useState<File | null>(null);

    const currentUser: user = appUseSelector((state: totalState) => state.user)
    const dispatch = useDispatch();

    const onSignUp = async (e: FormEvent) => {
        e.preventDefault();
        if (password === repeatPassword) {
            const data = await signUp({ username, email, password })(dispatch);
            if (data !== null) {
                setErrors(data)
            }
        } else {
            setErrors(['Passwords do not match'])
        }
    };

    const updateUsername: ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget) {
            setUsername(e.currentTarget.value)
        }
    };

    const updateEmail: ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget) {
            setEmail(e.currentTarget.value)
        }
    };

    const updatePassword: ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget) {
            setPassword(e.currentTarget.value)
        }
    };

    const updateRepeatPassword: ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget) {
            setRepeatPassword(e.currentTarget.value)
        }
    };

    if (currentUser.username) {
        return <Redirect to='/' />;
    }

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <form onSubmit={onSignUp} className='auth-form'>
                <div className='errors-container'>
                    {errors.map((error, ind) => (
                        <div className='errors-container' key={ind}>{error}</div>
                    ))}
                </div>
                <div>
                    <label className='required'>Username</label>
                    <input
                        type='text'
                        name='username'
                        placeholder='Required'
                        onChange={updateUsername}
                        value={username}
                    ></input>
                </div>
                <div>
                    <label className='required'>Email</label>
                    <input
                        type='text'
                        name='email'
                        placeholder='your_email@domain.com'
                        onChange={updateEmail}
                        value={email}
                    ></input>
                </div>
                <div>
                    <label className='required'>Password</label>
                    <input
                        type='password'
                        name='password'
                        placeholder='at least 6 characters'
                        onChange={updatePassword}
                        value={password}
                    ></input>
                </div>
                <div>
                    <label className='required'>Repeat Password</label>
                    <input
                        type='password'
                        name='repeat_password'
                        placeholder='at least 6 characters'
                        onChange={updateRepeatPassword}
                        value={repeatPassword}
                        required={true}
                    ></input>
                </div>
                <button className={'submit-button ' + theme} type='submit'>Create an Account</button>
                <div className={'sep ' + theme}><span>or</span></div>
                <NavLink to='/login'>I already have an account</NavLink>
            </form>
            <ImageDragAndDrop imageFile={imageFile} setImageFile={setImageFile} />
        </div>
    );
};

export default SignUpForm;
