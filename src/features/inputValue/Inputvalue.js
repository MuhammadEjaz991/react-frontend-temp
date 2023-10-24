// slice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showForm: false,
    value: 0,
    StoreUserData:''
};

const slice = createSlice({
    name: "app",
    initialState,
    reducers: {
        increment: state => {
            state.value += 1
        },
        decrement: state => {
            state.value -= 1
        },
        setShowForm: (state, action) => {
            state.showForm = action.payload;
        },
        setStoreUserData: (state, action) => {
            console.log('action payload', action.payload)
            state.StoreUserData = action.payload;
        },
    },
});

export const { setShowForm,increment,decrement,setStoreUserData } = slice.actions;

export default slice.reducer;
