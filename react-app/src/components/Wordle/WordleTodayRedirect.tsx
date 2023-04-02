import { useState, useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { wordle } from "../../classes/wordleTypes";
import { makeRandomWordle } from "./wordleFunctions";

export default function WordleTodayRedirect() {
    const now = new Date();
    const history = useHistory();
    let dateString = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');
    const [wordle, setWordle] = useState<null | wordle>(null)

    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/wordles/by_date/${dateString}`)
            if (res.ok) {
                const data = await res.json()
                setWordle(data)
                return
            }
            const resBody = await res.json()
            if (resBody.errors.includes('Puzzle not found')) {
                const data = await makeRandomWordle(history, null, null, true);
                setWordle(data);
            }
        })()
    }, [])

    return wordle ? (<Redirect to={`/wordles/${wordle.id}`} />) : null
}
