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
    profilePicture?: string;
    totalWordgons: number;
    totalWordles: number;
    createdAt?: string;
    email?: string;
    theme?: string;
    openSessions?: wordgonSession[];
    openWordles?: wordleSession[];
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
