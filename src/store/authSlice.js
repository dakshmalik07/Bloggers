import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status:  false,
    userData: null
}


//action gives payload
//reducer gives state
//state is the initial state
//action is the action that is dispatched
//createSlice is a function that takes an object and returns an object
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
        }
    }
})


export default authSlice.reducer;
export const { login, logout } = authSlice.actions;