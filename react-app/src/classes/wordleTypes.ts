

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

export interface normalizedWordleSessions {
    [id: number]: wordleSession
}

export interface wordleStats {
    [numGuesses: number]: number;
    min?: number;
    average?: number;
    total?: number;
}
