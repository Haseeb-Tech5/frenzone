import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    selectedUser: null,
    adminId: null,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    setAdminId: (state, action) => {
      state.adminId = action.payload;
    },
    clearAdminId: (state) => {
      state.adminId = null;
    },
  },
});

export const { setSelectedUser, clearSelectedUser, setAdminId, clearAdminId } =
  userSlice.actions;
export default userSlice.reducer;
