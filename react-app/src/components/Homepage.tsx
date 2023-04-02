import PuzzlesByDifficulty from "./Carousels/PuzzlesByDifficulty";
import PuzzlesOfTheDay from "./Carousels/PuzzlesOfTheDay";
import { useState } from "react";

export default function Homepage() {
    const [loaded1, setLoaded1] = useState<boolean>(false)
    const [loaded2, setLoaded2] = useState<boolean>(false)
    const [loaded3, setLoaded3] = useState<boolean>(false)
    const [loaded4, setLoaded4] = useState<boolean>(false)

    return <div id='homepage-loader' >
        <PuzzlesOfTheDay loaded={loaded1} setLoaded={setLoaded1} />
        <PuzzlesByDifficulty difficulty={'easy'} loaded={loaded2} setLoaded={setLoaded2} />
        <PuzzlesByDifficulty difficulty={'medium'} loaded={loaded3} setLoaded={setLoaded3} />
        <PuzzlesByDifficulty difficulty={'hard'} loaded={loaded4} setLoaded={setLoaded4} />
    </div>
}
