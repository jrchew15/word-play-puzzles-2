import { createSlice, PayloadAction, Slice, ThunkAction } from "@reduxjs/toolkit";
import { Dispatch, SetStateAction } from "react";
import { totalState } from ".";
import { errorResponse } from "../classes";
import { wordleSession, normalizedWordleSessions } from "../classes/wordleTypes";

const wordleSlice: Slice = createSlice({
    name: 'wordle',
    initialState: {},
    reducers: {
        setWordleSession(state, action: PayloadAction<wordleSession>): void {
            state[action.payload.puzzleId] = action.payload;
        },
        loadWordleSessions(state, action: PayloadAction<normalizedWordleSessions>): normalizedWordleSessions {
            return action.payload
        }
    }
});

export default wordleSlice.reducer;
export const { setWordleSession, loadWordleSessions, deleteWordleSession } = wordleSlice.actions;

export const thunkAddWordleSession = (puzzleId: number) => {
    return async (dispatch: Dispatch<PayloadAction<wordleSession>>): Promise<null | errorResponse> => {
        const res = await fetch(`/api/wordles/${puzzleId}/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            const data = await res.json() as wordleSession;
            await dispatch(setWordleSession(data));
            return null;
        }
        const errData = await res.json() as errorResponse;
        return errData;
    }
}

export const thunkUpdateWordleSession = (payload: { puzzleId: number, sessionId: number, newGuess: string }) => {
    return async (dispatch: Dispatch<PayloadAction<wordleSession>>) => {
        const res = await fetch(`/api/wordles/${payload.puzzleId}/sessions/${payload.sessionId}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ newGuess: payload.newGuess.toLowerCase() })
        });
        if (res.ok) {
            const data = await res.json() as wordleSession;
            dispatch(setWordleSession(data));
            return null;
        }
        const errData = await res.json() as errorResponse;
        return errData;
    }
}

export const thunkLoadWordleSessions = (): ThunkAction<Promise<null | errorResponse>, totalState, unknown, PayloadAction<normalizedWordleSessions>> => {
    return async (dispatch: Dispatch<PayloadAction<normalizedWordleSessions>>) => {
        const res = await fetch(`/api/users/current/wordle_sessions`);
        if (res.ok) {
            const data = await res.json() as normalizedWordleSessions;
            dispatch(loadWordleSessions(data));
            return null
        }
        const errData = await res.json() as errorResponse;
        return errData;
    }
}
