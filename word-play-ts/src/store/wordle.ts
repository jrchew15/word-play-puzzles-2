import { AnyAction, createSlice, PayloadAction, Slice, ThunkAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { totalState } from ".";
import { errorResponse } from "../classes";
import { wordleSession } from "../classes/wordleTypes";

const wordleSlice: Slice = createSlice({
    name: 'wordle',
    initialState: {},
    reducers: {
        setWordleSession(state, action: PayloadAction<wordleSession>): void {
            state.id = action.payload;
        },
        loadWordleSessions(state, action: PayloadAction<{ [id: number]: wordleSession }>): void {
            for (let key in action.payload) {
                state[key] = action.payload[key]
            }
        }
    }
});

export default wordleSlice.reducer;
export const { setWordleSession, loadWordleSessions, deleteWordleSession } = wordleSlice.actions;

export const thunkAddWordleSession = (puzzleId: number): ThunkAction<Promise<wordleSession | errorResponse>, totalState, unknown, PayloadAction<wordleSession>> => {
    return async (dispatch) => {
        const res = await fetch(`/api/wordles/${puzzleId}/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            const data = await res.json() as wordleSession;
            await dispatch(setWordleSession(data));
            return data;
        }
        const errData = await res.json() as errorResponse;
        return errData;
    }
}

export const thunkUpdateWordleSession = (payload: { puzzleId: number, sessionId: number, newGuess: string }): ThunkAction<Promise<wordleSession | errorResponse>, totalState, unknown, PayloadAction<wordleSession>> => {
    return async (dispatch: Dispatch<PayloadAction<wordleSession>>) => {
        const res = await fetch(`/api/wordles/${payload.puzzleId}/sessions/${payload.sessionId}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ newGuess: payload.newGuess })
        });
        if (res.ok) {
            const data = await res.json() as wordleSession;
            dispatch(setWordleSession(data));
        }
        const errData = await res.json() as errorResponse;
        return errData;
    }
}

export const thunkLoadWordleSessions = (): ThunkAction<Promise<null | errorResponse>, totalState, unknown, PayloadAction<{ [id: number]: wordleSession }>> => {
    return async (dispatch: Dispatch<PayloadAction<{ [id: number]: wordleSession }>>) => {
        const res = await fetch(`/api/users/current/wordle_sessions`);
        if (res.ok) {
            const data = await res.json() as { [id: number]: wordleSession };
            dispatch(loadWordleSessions(data));
            return null
        }
        const errData = await res.json() as errorResponse;
        return errData;
    }
}
