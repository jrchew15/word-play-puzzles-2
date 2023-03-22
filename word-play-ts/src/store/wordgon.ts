import { createSlice, Slice } from "@reduxjs/toolkit";
import { wordgonPlaceholder } from "../classes/types";

const wordgonSlice: Slice = createSlice({
    name: 'wordgon',
    initialState: { ...wordgonPlaceholder },
    reducers: {}
});

export default wordgonSlice.reducer;
