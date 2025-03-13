import { configureStore } from "@reduxjs/toolkit";

// import { useReducer } from "react";
import UserReducer from "./UserStore";

const Store = configureStore({
  reducer: {
    user: UserReducer, // Add user slice to store
  },
});
export default Store;
