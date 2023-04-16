import { configureStore, combineReducers, Middleware } from '@reduxjs/toolkit';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import userReducer from './user';
import wordgonReducer from './wordgon';
import wordleReducer from './wordle';
import { user } from '../classes/userTypes';
import { wordgon, wordgonSession } from '../classes/wordgonTypes';
import { wordleSession } from '../classes/wordleTypes';

const rootReducer = combineReducers({ user: userReducer, wordgon: wordgonReducer, wordle: wordleReducer });

let middlewareArr: Middleware[];

if (process.env.NODE_ENV === 'production') {
    middlewareArr = [thunk]
} else {
    middlewareArr = [thunk, logger]
}

export default function initializeStore() {
    return configureStore({
        reducer: rootReducer,
        middleware: middlewareArr
    });
}

export interface totalState {
    user: user,
    wordgon: { [id: number]: wordgonSession },
    wordle: { [id: number]: wordleSession }
}

export const appUseSelector: TypedUseSelectorHook<totalState> = useSelector;
