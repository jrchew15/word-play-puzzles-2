import { createSlice, PayloadAction, Slice, ThunkAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { errorResponse } from "../classes";
import { wordgonSession } from "../classes/wordgonTypes";
import { totalState } from ".";

const wordgonSlice: Slice = createSlice({
    name: 'wordgon',
    initialState: {},
    reducers: {
        setWordgonSession(state, action: PayloadAction<wordgonSession>): void {
            state.id = action.payload;
        },
        loadWordgonSessions(state, action: PayloadAction<{ [id: number]: wordgonSession }>): void {
            for (let key in action.payload) {
                state[key] = action.payload[key]
            }
        },
        deleteWordgonSession(state, action: PayloadAction<number>): void {
            delete state[action.payload]
        }
    }
});

export default wordgonSlice.reducer;
export const { setWordgonSession, loadWordgonSessions, deleteWordgonSession } = wordgonSlice.actions;


export const thunkAddWordgonSession = (puzzleId: number): ThunkAction<Promise<wordgonSession | errorResponse>, totalState, unknown, PayloadAction<wordgonSession>> => {
    return async (dispatch: Dispatch<PayloadAction<wordgonSession>>) => {
        const res = await fetch(`/api/wordgons/${puzzleId}/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        if (res.ok) {
            const data = await res.json() as wordgonSession;
            await dispatch(setWordgonSession(data))
            return data
        }
        const errData = await res.json() as errorResponse
        return errData
    }
}

export const thunkUpdateWordgonSession = (payload: { puzzleId: number, sessionId: number, guesses: string[], completed: boolean }): ThunkAction<Promise<wordgonSession | errorResponse>, totalState, unknown, PayloadAction<wordgonSession>> => {
    return async (dispatch: Dispatch<PayloadAction<wordgonSession>>) => {
        const parsedPayload = {
            guesses: payload.guesses.join(','),
            numGuesses: payload.guesses.length,
            completed: payload.completed
        }
        const res = await fetch(`/api/wordgons/${payload.puzzleId}/sessions/${payload.sessionId}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(parsedPayload)
        });
        if (res.ok) {
            const data = await res.json() as wordgonSession;
            dispatch(setWordgonSession(data))
            return data
        }
        const errData = await res.json() as errorResponse
        return errData
    }
}

export const thunkLoadWordgonSessions = (): ThunkAction<Promise<null | errorResponse>, totalState, unknown, PayloadAction<{ [id: number]: wordgonSession }>> => {
    return async (dispatch: Dispatch<PayloadAction<{ [id: number]: wordgonSession }>>, getState: () => totalState) => {
        const res = await fetch(`/api/users/current/wordgon_sessions`);

        if (res.ok) {
            const data = await res.json()
            dispatch(loadWordgonSessions(data))
            return null
        }
        const errData = await res.json() as errorResponse
        return errData
    }
}

export const thunkDeleteWordgonSession = (puzzleId: number, sessionId: number): ThunkAction<Promise<null | errorResponse>, totalState, unknown, PayloadAction<number>> => {
    return async (dispatch: Dispatch<PayloadAction<number>>) => {
        const res = await fetch(`/api/wordgons/${puzzleId}/sessions/${sessionId}`, { method: 'DELETE' });

        if (res.ok) {
            dispatch(deleteWordgonSession(sessionId))
            return null
        }
        const data = await res.json()
        return data
    }
}
