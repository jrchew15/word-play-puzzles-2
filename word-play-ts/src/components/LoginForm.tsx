import React, { FormEvent, FormEventHandler, SetStateAction, useState, Dispatch, MouseEventHandler, ChangeEventHandler, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';
import { user } from '../classes/types';
import { login } from '../store/user';
import { appUseSelector, totalState } from "../store";

// import './auth.css'

const LoginForm = () => {

    const theme = 'light' // Will eventually use context

    const [errors, setErrors] = useState<string[]>([]);
    const [credential, setCredential] = useState<string>(''); // can be username or email
    const [password, setPassword] = useState<string>('');
    const user: user = appUseSelector((state: totalState) => state.user)
    const dispatch = useDispatch();

    const onLogin: FormEventHandler = async (e: FormEvent) => {
        e.preventDefault();
        const data = await login(credential, password)(dispatch);
        if (data) {
            setErrors(data);
        }
    };

    const onDemoLogin: MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();
        const data = await login('Demo', 'password')(dispatch);
        if (data) {
            setErrors(data);
        }
    };

    const updateCredential: ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget) {
            setCredential(e.currentTarget.value);
        }
    };

    const updatePassword: ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget) {
            setPassword(e.currentTarget.value);
        }
    };

    if (user.username !== '') {
        return <Redirect to='/' />;
    }

    return (
        <form onSubmit={onLogin} id='login-form' className='auth-form'>
            <div className='errors-container'>
                {errors.map((error, ind) => (
                    <div key={ind}>{error}</div>
                ))}
            </div>
            <div>
                <label htmlFor='credential' className='required'>Email or Username</label>
                <input
                    name='credential'
                    type='text'
                    placeholder='Email or Username'
                    value={credential}
                    onChange={updateCredential}
                    required
                />
            </div>
            <div>
                <label htmlFor='password' className='required'>Password</label>
                <input
                    name='password'
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={updatePassword}
                    required
                />
            </div>
            <button className={'submit-button ' + theme}>Continue</button>
            <div className={'sep ' + theme}><span style={{ padding: '0 5px' }}>or</span></div>
            <NavLink to='/sign-up'>Sign Up as a New User</NavLink>
            <div className={'sep ' + theme} style={{ paddingTop: 10 }}><span style={{ padding: '0 5px' }}>or</span></div>
            <button type='button' onClick={onDemoLogin} className={'submit-button ' + theme}>Log in as Demo User</button>
        </form>
    );
};

export default LoginForm;
