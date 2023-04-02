import { useState, useEffect, AnimationEventHandler } from 'react'
import { checkWordleGuess } from './wordleFunctions'
import './row.css'
import './wordle-animation.css'

export function EmptyRow() {

    return <div className="wordle-row" >
        <div className="wordle-letter blank" />
        <div className="wordle-letter blank" />
        <div className="wordle-letter blank" />
        <div className="wordle-letter blank" />
        <div className="wordle-letter blank" />
    </div >
}

export function CurrentRow(props: { guess: string }) {

    // squares extends guess to create empty slots when fewer than 5 characters in guess
    let squares: (null | string)[] = new Array(5).fill(null);
    for (let i = 0; i < props.guess.length; i++) {
        squares[i] = props.guess[i]
    }
    return <div className='wordle-row'>
        {squares.map((char, i) => (
            <div className='wordle-letter blank' key={`empty,current,${i}`}>{char}</div>
        ))}
    </div>
}

export function AnimatedRow(props:{ guess: string, word: string, row: number }) {
    let colors = checkWordleGuess(props.word, props.guess);
    const [aninumber, setAninumber] = useState(-1);

    // will be called onAnimationEnd of previous letter
    const sequenceAnimation: AnimationEventHandler<HTMLDivElement> = (e) => {
        if (aninumber <= 3) {
            setAninumber(num => num + 1)
            return
        }
    }

    useEffect(() => {
        setAninumber(0)
    }, [])

    return <div className='wordle-row' >
        {props.guess.split('').map((char, i) => (i <= aninumber ?
            <div
                className={`wordle-letter ${colors[i]} animated`}
                onAnimationEnd={sequenceAnimation}
                key={`${props.row},${i}`}
            >
                {char.toUpperCase()}
            </div>
            : <div className='wordle-letter blank' key={`empty${props.row},${i}`} />
        ))}
    </div>
}
