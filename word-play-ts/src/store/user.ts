import { createSlice, Slice, PayloadAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { userPlaceholder, user, userSignup } from "../classes/userTypes";
import { errorResponse } from '../classes/index';
import { loadWordgonSessions } from "./wordgon";
import { loadWordleSessions } from "./wordle";

const userSlice: Slice = createSlice({
    name: 'user',
    initialState: { ...userPlaceholder },
    reducers: {
        setUser(state, action: PayloadAction<user>): user {
            return action.payload
        },
        removeUser(state, action: PayloadAction<null>): user {
            return userPlaceholder
        }
    }
});

export default userSlice.reducer;
export const { setUser, removeUser } = userSlice.actions;

export const authenticate = () => async (dispatch: Dispatch<PayloadAction<user>>) => {
    const response = await fetch('/api/auth/', {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        const data = await response.json() as user;

        dispatch(setUser(data));
    } else {
        const errData = await response.json() as errorResponse;
        return errData
    }

}

export const login = (credential: string, password: string) => async (dispatch: Dispatch<PayloadAction<user>>) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            credential,
            password
        })
    });


    if (response.ok) {
        const data: user = await response.json();
        dispatch(setUser(data))
        return null;
    } else if (response.status < 500) {
        const data = await response.json() as errorResponse;
        return data;
    } else {
        return ['An error occurred. Please try again.']
    }

}

export const logout = () => async (dispatch: Dispatch<PayloadAction<null>>): Promise<void> => {
    const response = await fetch('/api/auth/logout', {
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (response.ok) {
        dispatch(removeUser(null));
        dispatch(loadWordgonSessions({}));
        dispatch(loadWordleSessions({}));
    }
};

export const editUserThunk = (userId: number, payload: user) => async (dispatch: Dispatch<PayloadAction<user>>) => {
    const formData = new FormData();

    if (payload.id !== undefined) {
        formData.append('id', payload.id.toString())
    }
    if (payload.username !== undefined) {
        formData.append('username', payload.username)
    }
    if (payload.profilePicture !== undefined) {
        formData.append('profilePicture', payload.profilePicture)
    }
    if (payload.email !== undefined) {
        formData.append('email', payload.email)
    }

    const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        body: formData
    });

    if (response.ok) {
        const data: user = await response.json();
        dispatch(setUser(data))
        return null;
    } else if (response.status < 500) {
        const data: errorResponse = await response.json();
        if (data.errors) {
            return data.errors;
        }
    } else {
        return ['An error occurred. Please try again.']
    }
}

export const signUp = (payload: userSignup) => async (dispatch: Dispatch<PayloadAction<user>>) => {
    const formData = new FormData();

    if (payload.username !== undefined) {
        formData.append('username', payload.username)
    }
    if (payload.profilePicture !== undefined) {
        formData.append('profilePicture', payload.profilePicture)
    }
    if (payload.email !== undefined) {
        formData.append('email', payload.email)
    }
    if (payload.password !== undefined) {
        formData.append('password', payload.password)
    }

    const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data))
        return null;
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.errors) {
            return data.errors;
        }
    } else {
        return ['An error occurred. Please try again.']
    }
}
