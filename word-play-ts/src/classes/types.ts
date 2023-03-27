import { JSXElementConstructor } from "react";
import { JsxElement } from "typescript";

export type Props = {
    message: string;
    children?: JSX.Element;
    onClose?: VoidFunction;
}

export interface user {
    id: number;
    username: string;
    profilePicture?: string | File;
    totalWordgons: number;
    totalWordles: number;
    createdAt?: string;
    email?: string;
    theme?: string;
    openSessions?: wordgonSession[];
    openWordles?: wordleSession[];
    status?: 'success';
}

export interface userSignup extends user {
    password: string
}

export const userPlaceholder = {
    id: 0,
    username: '',
    totalWordgons: 0,
    totalWordles: 0
}

export interface wordgon {
    id: number;
    letters: string;
    userId: number;
    numAttempts: number;
    puzzleDay: string;
    user: user;
}

export const wordgonPlaceholder: wordgon = {
    id: 0,
    letters: '',
    userId: 0,
    numAttempts: 0,
    puzzleDay: '',
    user: userPlaceholder
}

export interface wordgonSession {
    id: number;
    puzzleId: number;
    userId: number;
    guesses: string;
    numGuesses: number;
    completed: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const wordgonSessionPlaceholder: wordgonSession = {
    id: 0,
    puzzleId: 0,
    userId: 0,
    guesses: '',
    numGuesses: 0,
    completed: false
}

export interface wordle {
    id: number;
    word: string;
    puzzleDay?: string;
}

export interface wordleSession {
    id: number;
    puzzleId: number;
    userId: number;
    guesses: string;
    numGuesses: number;
    completed: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const wordleSessionPlaceholder: wordleSession = {
    id: 0,
    puzzleId: 0,
    userId: 0,
    guesses: '',
    numGuesses: 0,
    completed: false
}

export interface errorResponse {
    status: 'failed';
    errors: string[]
}
