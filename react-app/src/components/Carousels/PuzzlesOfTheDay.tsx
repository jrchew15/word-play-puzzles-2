import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useHistory } from "react-router-dom";
import { ListableBoxAndLetters, DetailsByStatus } from "../WordGon/WordGonBox";
import PuzzleCarousel from "./PuzzleCarousel";
import { puzzleDifficulty, dbDateToDateObj } from "../../utils/puzzleFunctions";
import { makeRandomWordle } from "../Wordle/wordleFunctions";
import '../WordGon/wordgon-list.css';
import './carousel.css'
import { wordgon } from "../../classes/wordgonTypes";

export default function PuzzlesOfTheDay(props: { loaded: boolean, setLoaded: Dispatch<SetStateAction<boolean>> }) {
    const [puzzles, setPuzzles] = useState<wordgon[]>([])
    const history = useHistory();
    const now = new Date();

    const [makingWordle, setMakingWordle] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await fetch('/api/wordgons/puzzles_of_the_day');
            const data = await res.json()

            if (res.ok) {
                let pastPuzzles = data.puzzles.filter((puzzle: wordgon): boolean => dbDateToDateObj(puzzle.puzzleDay) < now)
                setPuzzles(pastPuzzles)
                props.setLoaded(true)
            }
        })()
    }, [setPuzzles])

    useEffect(() => {
        if (makingWordle) {
            (async () => {
                await makeRandomWordle(history);
                setMakingWordle(false)
            })()
        }
    }, [makingWordle])

    return loaded ? (
        <>
            {puzzles.length > 0 && <div id='the-pod'>
                <h2 style={{ color: 'whitesmoke' }}>Today's Puzzles:</h2>
                <div id='pod-cards'>
                    <div className="puzzle-card wordle" onClick={() => history.push(`/wordles/today`)}>
                        <h2>Wordle of the Day</h2>
                        <img src='/static/images/alpha-wordle-icon.png' alt='wordle' />
                    </div>
                    <div className="puzzle-card" onClick={() => history.push(`/wordgons/${puzzles[0].id}`)} >
                        <div className='puzzle-title' >
                            <span style={{ margin: '5px 0' }}>{parseDate(puzzles[0].puzzleDay)}</span>
                        </div>
                        <div style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ListableBoxAndLetters letters={puzzles[0].letters} puzzleId={puzzles[0].id} difficulty={puzzleDifficulty(puzzles[0])} />
                            <DetailsByStatus puzzleId={puzzles[0].id} />
                        </div>
                    </div>
                    <div className="puzzle-card wordle" onClick={() => setMakingWordle(true)}>
                        <h2>Random wordle</h2>
                        <i className="far fa-question-circle"></i>
                        <img src='/static/images/alpha-wordle-icon.png' alt='wordle' style={{ opacity: '0.5' }} />
                    </div>
                </div>
            </div>}
            <h2>Past Puzzles of the Day</h2>
            <PuzzleCarousel puzzles={puzzles.slice(1)} />
        </>
    ) : null
}

export function parseDate(date: string): string {
    const dateArr: number[] = date.split('-').map((x: string): number => +x);
    const dateObj = new Date(dateArr[0], dateArr[1], dateArr[2]);
    const months: { [num: string]: string } = {
        '1': 'Jan',
        '2': 'Feb',
        '3': 'Mar',
        '4': 'Apr',
        '5': 'May',
        '6': 'Jun',
        '7': 'Jul',
        '8': 'Aug',
        '9': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec',
        '0': 'Dec'
    }
    return `${months[dateObj.getMonth().toString()]} ${dateObj.getDate().toString()}, ${dateObj.getFullYear().toString()}`
}
