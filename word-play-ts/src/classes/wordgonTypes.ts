import { userPlaceholder, user } from "./userTypes";

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
