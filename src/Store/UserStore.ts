import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  Name: string;
  Email: string;
  Password: string;
  isLogin: boolean;
}

const initialState: UserState = {
  Name: "",
  Email: "",
  Password: "",
  isLogin: false,
};

const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload }; // Merge new data into state
    },
  },
});

export default UserSlice.reducer;
export const { addUser } = UserSlice.actions;
