import { createSlice, Slice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { userPlaceholder, user, errorResponse, userSignup } from "../classes/types";

const userSlice: Slice = createSlice({
    name: 'user',
    initialState: { ...userPlaceholder },
    reducers: {
        setUser(state, action: PayloadAction<user>): void {
            const { id, username, profilePicture, totalWordgons, totalWordles, createdAt, email, theme, openSessions, openWordles } = action.payload;
            state.id = id;
            state.username = username;
            state.profilePicture = profilePicture || '';
            state.totalWordgons = totalWordgons;
            state.totalWordles = totalWordles;
            state.createdAt = createdAt;
            state.theme = theme;
            state.email = email;
            state.openSessions = openSessions;
            state.openWordles = openWordles;
        },
        removeUser(state, action: PayloadAction<null>): void {
            state = userPlaceholder
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
        const data: user | errorResponse = await response.json();
        if (data.status === 'failed') {
            return;
        }

        dispatch(setUser(data));
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
        const data: user | errorResponse = await response.json();
        if (data.status === 'failed') {
            return data.errors;
        }
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
