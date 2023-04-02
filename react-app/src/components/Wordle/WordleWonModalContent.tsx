import { useEffect, useState } from "react";
import { appUseSelector, totalState } from "../../store";
import { user } from "../../classes/userTypes";
import { wordleSession, wordleStats } from "../../classes/wordleTypes";

export default function WordleWonModalContent(props: { wordle_id: number }) {
    const [puzzleSession, setPuzzleSession] = useState<null | wordleSession>(null);
    const [globalStats, setGlobalStats] = useState<null | wordleStats>(null);
    const [userStats, setUserStats] = useState<null | wordleStats>(null);
    const [userStatsStyles, setUserStatsStyles] = useState<null | { [i: number]: { width?: string } | { display?: 'none' } }>(null);

    const currentUser: user = appUseSelector((state: totalState) => state.user)
    useEffect(() => {
        (async () => {
            // refetch session to ensure db has updated
            if (!puzzleSession) {
                (async () => {
                    let sesh = await fetch(`/api/wordles/${props.wordle_id}/sessions/current`);
                    if (sesh.ok) {
                        const data = await sesh.json();
                        setPuzzleSession(data);
                    }
                })()
                return
            }

            // after session is fetched, fetch stats
            const resGlobalStats = await fetch(`/api/wordles/${props.wordle_id}/stats`);
            if (resGlobalStats.ok) {
                const globalStatsBody = await resGlobalStats.json()
                // min is the fewest guesses taken by any user
                let min = Math.min(...Object.keys(globalStatsBody).map(n => +n || Infinity));
                globalStatsBody.min = min;
                setGlobalStats(globalStatsBody);
            }

            const resUserStats = await fetch(`/api/users/${currentUser.id}/wordle_stats`);
            if (resUserStats.ok) {
                const userBodyStats: wordleStats = await resUserStats.json()
                // remove average for clean percentages
                delete userBodyStats['average']
                setUserStats(userBodyStats)
                let max = Math.max(...Object.values(userBodyStats));

                // set appropriate bar graph widths
                const styles: { [i: number]: { width?: string } | { display?: 'none' } } = {}
                for (let i = 1; i <= 6; i++) {
                    if (userBodyStats[i]) {
                        let width = Math.round(100 * userBodyStats[i] / max) + '%';
                        styles[i] = { width }
                    } else {
                        styles[i] = { display: 'none' }
                    }
                }
                setUserStatsStyles(styles)
            }
        })()
    }, [currentUser, setGlobalStats, setUserStats, puzzleSession])

    return (globalStats && userStats && userStatsStyles && puzzleSession && <div>
        <h3>Congratulations!</h3>
        <p>You used {puzzleSession.numGuesses} out of 6 words, compared to the global average of {globalStats.average} guesses</p>
        {globalStats.total && globalStats.min && globalStats.total > 1 && (<p>{globalStats[globalStats.min]} {globalStats[globalStats.min] === 1 ? 'user' : 'users'} found the word in {globalStats.min} guesses</p>)}
        <div id='modal-stats-separator' />
        < ul id={'modal-stats'} >
            <h4>Your Wordle Stats:</h4>
            {
                [6, 5, 4, 3, 2, 1].map(num => (
                    <li key={num} style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', position: 'relative' }}>
                        <span>{num}:</span>
                        <div className={'statbar' + (puzzleSession.numGuesses === num ? ' relevant' : '')} style={userStatsStyles[num]} />
                        <span >{userStats[num]}</span>
                    </li>
                ))
            }
        </ul >
    </div >)
}
