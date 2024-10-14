import { createAction, createSlice } from "@reduxjs/toolkit";

export const initializeProfile = createAction("fbProfile/initializeProfile");

const fbProfileSlice = createSlice({
  name: "fbProfile",
  initialState: {
    profile: {
      name: "",
      email: "",
      role: "",
      id: "",
    },
  },
  reducers: {
    updateProfile(state, action) {
      state.profile = action.payload;
    },
  },
});

export const { updateProfile } = fbProfileSlice.actions;

export default fbProfileSlice.reducer;
