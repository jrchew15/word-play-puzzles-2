import { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import './wordle-keyboard.css';

// all props are necessary for event handling within keyboard
export default function WordleKeyboard(props: { word: string, guesses: string[], currentGuess: string, setCurrentGuess: Dispatch<SetStateAction<string>>, setSubmitting: Dispatch<SetStateAction<boolean>> }) {
    let row1 = 'QWERTYUIOP';
    let row2 = 'ASDFGHJKL';
    let row3 = 'ZXCVBNM';

    // class names will be the values in colorObj assigned to character keys
    let colorObj: { [guessNum: string]: 'green' | 'yellow' | 'gray' } = {};

    for (let guess of props.guesses) {
        let mutableWordArr: (string | null)[] = props.word.split('');
        for (let i = 0; i < 5; i++) {
            if (mutableWordArr[i] === guess[i]) {
                colorObj[guess[i]] = 'green';
                // remove from word array because color should remain green regardless of other guesses
                mutableWordArr[i] = null;
            }
        }
        for (let i = 0; i < 5; i++) {
            if (colorObj[guess[i]]) continue
            if (mutableWordArr[i] !== 'green' || mutableWordArr[i] !== 'yellow') {
                colorObj[guess[i]] = mutableWordArr.includes(guess[i]) ? 'yellow' : 'gray';
            }
        }
    }


    //keyboard event handlers
    const keyboardClickHandle: MouseEventHandler<HTMLDivElement> = (e) => {
        if (e.currentTarget && e.currentTarget.className.includes('keyboard-letter') && props.currentGuess.length < 5) {
            props.setCurrentGuess(word => word + e.currentTarget.innerText)
        }
    }
    const enterKey: MouseEventHandler<HTMLDivElement> = (e) => {
        if (props.currentGuess.length < 5) return
        props.setSubmitting(true)
    }
    const backspaceKey: MouseEventHandler<HTMLDivElement> = (e) => {
        if (props.currentGuess.length > 0) props.setCurrentGuess(word => word.slice(0, word.length - 1))
    }

    return <div id='wordle-keyboard' onClick={keyboardClickHandle}>
        <div className="row 1">
            {row1.split('').map(char => (
                <div key={char.toLowerCase() + ',keyboard'} className={'keyboard-letter ' + (colorObj[char.toLowerCase()] || '')}>
                    {char}
                </div>
            ))}
        </div>
        <div className="row 2">
            {row2.split('').map(char => (
                <div key={char.toLowerCase() + ',keyboard'} className={'keyboard-letter ' + (colorObj[char.toLowerCase()] || '')}>
                    {char}
                </div>
            ))
            }
        </div >
        <div className="row 3">
            <div className="special-key" onClick={enterKey}>Enter</div>
            {row3.split('').map(char => (
                <div key={char.toLowerCase() + ',keyboard'} className={'keyboard-letter ' + (colorObj[char.toLowerCase()] || '')}>
                    {char}
                </div>
            ))}
            <div className="special-key" onClick={backspaceKey}><i className="fas fa-backspace" /></div>
        </div >
    </div >
}
