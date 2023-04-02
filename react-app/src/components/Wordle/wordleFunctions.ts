import { Dispatch, SetStateAction } from "react";
import { RouterChildContext } from "react-router";
import { wordle, wordleSession } from "../../classes/wordleTypes";
import { authenticate } from "../../store/user";

export function checkWordleGuess(word: string[5], guess: string[5]) {
    // assigns colors to each letter of guess
    let mutableWordArr: (string | null)[] = word.split('');
    let colors = new Array(5);
    // order of assignment: green, yellow, gray
    // defined order is necessary for logical consistency with repeat letters in guess
    for (let i = 0; i < 5; i++) {
        if (mutableWordArr[i] === guess[i]) {
            colors[i] = 'green';
            mutableWordArr[i] = null;
        }
    }
    for (let i = 0; i < 5; i++) {
        if (!colors[i]) {
            if (mutableWordArr.includes(guess[i])) {
                colors[i] = 'yellow';
                mutableWordArr[mutableWordArr.indexOf(guess[i])] = null;
                continue
            }
            colors[i] = 'gray'
        }
    }
    return colors
}

// setGuesses and setSession may be passed in to clear history if navigating from a puzzle page
export async function makeRandomWordle(history: RouterChildContext['router']['history'], setGuesses: null | Dispatch<SetStateAction<string[]>> = null, setSession: null | Dispatch<SetStateAction<wordleSession | null>> = null, daily = false) {
    // when not making a new daily wordle, query for an existing puzzles that user has not attempted
    if (!daily) {
        const existingRes = await fetch('/api/wordles/random')
        if (existingRes.ok) {
            if (setSession) setSession(null)
            if (setGuesses) setGuesses([])
            const { id: wordleId } = await existingRes.json();
            history.push(`/wordles/${wordleId}`)
            return
        }
    }

    // returns a random 5 letter word that has not been used for a puzzle
    const wordRes = await fetch('/api/words/random-wordle')

    if (wordRes.ok) {
        const { word } = await wordRes.json()

        const wordleRes = await fetch(`/api/wordles`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ word, isPuzzleDay: daily })
        })

        if (wordleRes.ok) {
            if (setSession) setSession(null)
            if (setGuesses) setGuesses([])
            const wordle = await wordleRes.json();
            if (!daily) {
                history.push(`/wordles/${wordle.id}`)
            } else {
                // daily===true only when called from WordleTodayRedirect
                return wordle
            }
            return
        }
    }
    // return to home on failure
    history.push('/')
}

export async function findWordlePuzzle(puzzleId: number, setPuzzle: Dispatch<SetStateAction<null | wordle>>, history: RouterChildContext['router']['history']) {

    let res = await fetch(`/api/wordles/${puzzleId}`);

    if (res.ok) {
        let data = await res.json()
        setPuzzle(data)
        return
    }
    history.push('/404')
}

export async function findWordleSession(puzzle: wordle, dispatch: Dispatch<any>, history: RouterChildContext['router']['history'], setSession: Dispatch<SetStateAction<null | wordleSession>>, setCompleted: Dispatch<SetStateAction<boolean>>) {

    if (!puzzle) return
    const res = await fetch(`/api/wordles/${puzzle.id}/sessions/current`)
    const data = await res.json()

    if (res.ok) {
        setSession(data)
        setCompleted(data.completed)
        return
    }

    if (data.errors.includes('session not found')) {

        // If no session found, create a session
        const newRes = await fetch(
            `/api/wordles/${puzzle.id}/sessions`,
            { method: 'POST' }
        );
        const newData = await newRes.json();
        await dispatch(authenticate())
        setSession(newData)
        setCompleted(false)
        return
    }
    history.push('/404')
}

export async function updateWordleSession(puzzle: wordle, session: wordleSession, currentGuess: string, setCompleted: Dispatch<SetStateAction<boolean>>, setWon: Dispatch<SetStateAction<boolean>>, setShowModal: Dispatch<SetStateAction<boolean>>, setGuesses: Dispatch<SetStateAction<string[]>>, setCurrentGuess: Dispatch<SetStateAction<string>>) {
    const res = await fetch(`/api/wordles/${puzzle.id}/sessions/${session.id}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ newGuess: currentGuess.toLowerCase() })
    })

    let data = await res.json()
    if (res.ok) {
        if (data.completed) {
            setCompleted(true)
            setWon(currentGuess.toLowerCase() === puzzle.word)
            setShowModal(true)
        }
        setGuesses(arr => [...arr, currentGuess.toLowerCase()])
        setCurrentGuess('')
    } else {
        return data
    }
}
