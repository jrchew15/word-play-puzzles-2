import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { wordgon } from '../../classes/wordgonTypes';
import PuzzleCarousel from './PuzzleCarousel';

export default function PuzzlesByDifficulty(props: { difficulty: string, loaded: boolean, setLoaded: Dispatch<SetStateAction<boolean>> }) {
    const [puzzles, setPuzzles] = useState<wordgon[]>([]);

    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/wordgons/difficulty/${props.difficulty}`);
            const data = await res.json()

            if (res.ok) {
                setPuzzles(data.puzzles)
                props.setLoaded(true)
            }
        })()
    }, [setPuzzles])

    return props.loaded ? (
        <>
            <h2>{props.difficulty[0].toUpperCase() + props.difficulty.slice(1)} Puzzles</h2>
            <PuzzleCarousel puzzles={puzzles} />
        </>
    ) : null
}
