import { useState, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { parseDate } from "./Carousels/PuzzlesOfTheDay";
import { user, wordgon, userPlaceholder, wordgonPlaceholder } from "../classes/types";
import { appUseSelector, totalState } from "../store";
// import { ListableBoxAndLetters, DetailsByStatus } from "./WordGon/WordGonBox";


export default function SplashPage() {

    const currentUser: user = appUseSelector((state: totalState) => state.user)
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [puzzle, setPuzzle] = useState<wordgon>(wordgonPlaceholder);
    const history = useHistory();


    useEffect(() => {
        const today_date = new Date();
        (async () => {
            const res = await fetch(`/api/wordgons/by_date/${today_date.getFullYear()}-${today_date.getUTCMonth() + 1}-${today_date.getDate()}`);
            const data = await res.json()
            if (res.ok) {
                setPuzzle(data)
            }

            setIsLoaded(true)
        })()
    }, [setPuzzle])

    if (!isLoaded || !puzzle.id) {
        return null
    }

    // return currentUser.id ? <Redirect to='/' /> : <div id='splash'>
    return <div id='splash'>
        <img id='splash-bkg' src='/static/images/icon_square.svg' alt='word-play' className="unselectable" />
        <h1 style={{ fontSize: '3em' }}>Welcome to Word Play</h1>
        <div id='splash-card-container'>
            <div className='splash-card' onClick={() => history.push(`/wordgons/${puzzle.id}`)}>
                <h2>Puzzle of the Day</h2>
                <div style={{ backgroundColor: 'rgb(253 181 21 / 64%)', width: '100%', display: 'flex', justifyContent: 'center', padding: '5px 0', borderTop: '2px solid black' }}>
                    <span style={{ margin: '5px 0' }}>{parseDate(puzzle.puzzleDay)}</span>
                </div>
                <div style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', backgroundColor: 'rgb(253 181 21 / 64%)', borderRadius: '0 0 15px 15px' }}>
                    {/* <ListableBoxAndLetters letters={puzzle.letters} puzzleId={puzzle.id} />
                    <DetailsByStatus puzzleId={puzzle.id} /> */}
                </div>
            </div>
            <div className='splash-card'>
                <div className='auth-buttons' style={{ fontSize: '1.6em', borderRadius: '15px 15px 0 0' }} onClick={() => history.push('/signup')}>Sign Up</div>
                <div className="splash-card-sep" />
                <div className='auth-buttons' style={{ fontSize: '1.6em', borderRadius: '0 0 15px 15px' }} onClick={() => history.push('/login')}>Log In</div>
            </div>
        </div>
    </div>
}
