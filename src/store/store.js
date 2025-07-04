import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import postSlice from "./postSlice";
import commentsSlice from "./commentsSlice";


const store = configureStore({
    reducer: {
        auth : authSlice,
        posts: postSlice,
        comments: commentsSlice
    }
});
export default store;