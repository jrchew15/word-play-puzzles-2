import { createSlice, Slice, createSelector } from "@reduxjs/toolkit";
import { userPlaceholder, user } from "../classes/types";

const userSlice: Slice = createSlice({
    name: 'user',
    initialState: { ...userPlaceholder },
    reducers: {}
});

export default userSlice.reducer;
