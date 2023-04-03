import { useState, useEffect, useRef, Dispatch, SetStateAction, FormEventHandler, ChangeEventHandler, KeyboardEventHandler, MouseEventHandler } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkWordsTable } from "../../utils/wordchecks";
import { EmptyRow, CurrentRow, AnimatedRow } from "./WordleRow";
import WordleKeyboard from "./WordleKeyboard";
import WordleLoader from "./WordleLoader";
import { Modal } from "../../context/Modal";
import { makeRandomWordle, findWordlePuzzle, findWordleSession, updateWordleSession } from "./wordleFunctions";
import WordleWonModalContent from "./WordleWonModalContent";
import './wordle-puzzle.css';
import { wordle, wordleSession } from "../../classes/wordleTypes";
import { thunkUpdateWordleSession } from "../../store/wordle";

export default function WordlePuzzle() {
    const puzzleId = +useParams<{ wordleId: string }>().wordleId;
    let history = useHistory();
    let dispatch = useDispatch();

    const [guesses, setGuesses] = useState<string[]>([])
    const [currentGuess, setCurrentGuess] = useState<string>('')

    const [errors, setErrors] = useState<string[]>([])
    const [completed, setCompleted] = useState<boolean>(false)

    const [session, setSession] = useState<null | wordleSession>(null)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [won, setWon] = useState<boolean>(false)

    // submitting boolean used in a useEffect dependency array
    // prevents multiple submission
    const [submitting, setSubmitting] = useState<boolean>(false)

    const formRef = useRef<null | HTMLInputElement>(null);

    const [puzzle, setPuzzle] = useState<null | wordle>(null)

    //find puzzle
    useEffect(() => {
        findWordlePuzzle(puzzleId, setPuzzle, history)
    }, [puzzleId, setPuzzle])

    //find session when puzzle is found
    useEffect(() => {
        if (puzzle) {
            findWordleSession(puzzle, dispatch, history, setSession, setCompleted)
        }
    }, [puzzle, dispatch, history, setSession, setCompleted])

    // display progress from found session
    useEffect(() => {
        if (session && session.guesses.length) {
            let guessArr = session.guesses.split(',')
            setGuesses(guessArr)
            setWon(session.completed && guessArr[guessArr.length - 1] === (puzzle && puzzle.word))
        }
    }, [session, setGuesses, setWon])

    // submission handler wrapped in useEffect
    // prevents multiple submissions by watching for submitting boolean in dependency array
    useEffect(() => {
        if (!puzzle || !session || !submitting || !formRef) return

        (async () => {

            // check word validity
            const valid = await checkWordsTable(currentGuess)

            if (valid) {
                // update session
                // const errData = await updateWordleSession(puzzle, session, currentGuess, setCompleted, setWon, setShowModal, setGuesses, setCurrentGuess);
                const res = await thunkUpdateWordleSession({ puzzleId, sessionId: session.id, newGuess: currentGuess })(dispatch)

                if (res) {
                    // if db update error
                    setErrors(res.errors);
                    setTimeout(() => { setErrors([]) }, 2000);
                }
            } else {
                // if invalid word, display error for 2 seconds
                setErrors(['Not a valid word'])
                setTimeout(() => { setErrors([]) }, 2000)
            }

            setSubmitting(false)
        })()

    }, [submitting])

    if (!puzzle || !session) return null

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setSubmitting(true)
    }

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setCurrentGuess(e.target.value)
    }

    const handleKey: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.ctrlKey) {
            // prevent pasting
            if (e.key.toLowerCase() === 'v') e.preventDefault()
            return
        }
        if (e.key === 'Enter' && currentGuess.length === 5) return
        e.preventDefault();
        if (e.key.length === 1 && e.key.match(/[a-z]/i) && currentGuess.length < 5) {
            setCurrentGuess(currentGuess + e.key.toUpperCase());
            return
        }
        if (e.key === 'Backspace' && currentGuess.length > 0) {
            setCurrentGuess(currentGuess.slice(0, currentGuess.length - 1));
        }
    }
    // focuses 'hidden' form element when clicking anywhere on puzzle
    const focusForm: MouseEventHandler<HTMLDivElement> = (e) => {
        if (formRef?.current) {
            formRef.current.focus()
        }
    }

    // initialize as many empty rows as needed
    let emptyRows = guesses.length < 6 ? new Array(5 - guesses.length).fill(null) : []

    return (
        <div id='wordle-page' onClick={focusForm}>
            <h2 style={{ color: 'white', position: 'absolute', left: 50, top: 50 }}>Wordle</h2>
            <div id='wordle-rows'>
                {session.completed && !won && <div id='wordle-lost-display'>{puzzle.word.toUpperCase()}</div>}
                {guesses.map((guess, idx) => <AnimatedRow guess={guess} word={puzzle.word} row={idx} key={`${guess}${idx}`} />)}
                {guesses.length < 6 && (
                    <CurrentRow guess={currentGuess} />
                )}
                {emptyRows.map((empty, i) => <EmptyRow key={`empty-row-${i}`} />)}
            </div>
            <div id='wordle-message-container'>
                <div id='wordle-errors' className={errors.length > 0 ? 'on' : 'off'}>
                    {errors.map((err, i) => <span key={`error,${i}`} > {err}</span>)}
                </div>
                {submitting && !errors.length && <WordleLoader />}
            </div>
            {
                !completed && <form id='wordle-form' onSubmit={handleSubmit}>
                    <input
                        type='text'
                        name='wordle'
                        onChange={handleChange}
                        onKeyDown={handleKey}
                        autoFocus
                        autoComplete="off"
                        ref={formRef}
                        value={currentGuess}
                    />
                </form>
            }
            <WordleKeyboard word={puzzle.word} guesses={guesses} currentGuess={currentGuess} setCurrentGuess={setCurrentGuess} setSubmitting={setSubmitting} />
            <EndModal />
            {completed && <button id='view-stats-button' onClick={() => setShowModal(true)}>View Stats</button>}
        </div >
    )

    // displays when puzzle is completed
    // nested to prevent prop drilling
    function EndModal() {
        return showModal && puzzle ? (
            <Modal onClose={() => setShowModal(false)}>
                <div id='complete-modal'>
                    {won ? (
                        <WordleWonModalContent wordle_id={puzzleId} />
                    ) : <>
                        <h2>Sorry!</h2>
                        <span>{`you ran out of guesses. The word was "${puzzle.word.toUpperCase()}"`}</span>
                    </>}
                    <div id='wordle-buttons'>
                        <button className="modal-button" onClick={() => { history.push('/') }}>Back to puzzles</button>
                        <button className="modal-button" onClick={() => { setShowModal(false); makeRandomWordle(history, setGuesses, setSession) }}>Random Wordle</button>
                    </div>
                </div>
            </Modal>
        ) : null
    }
}
