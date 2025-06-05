// src/redux/features/admin/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialUser =
  typeof window !== "undefined" && localStorage.getItem("adminUser")
    ? JSON.parse(localStorage.getItem("adminUser"))
    : null;

const userSlice = createSlice({
  name: "adminUser",
  initialState: {
    user: initialUser,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("adminUser", JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminToken");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
