import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllProfiles,
  fetchProfileById,
  updateProfile,
  deleteAccount,
} from "./userAction";

const initialState = {
  profiles: [],
  profile: null,
  loading: false,
  error: null,
  success: null, // Add success state
};

const profileSlice = createSlice({
  name: "profiles",
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all profiles
      .addCase(fetchAllProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchAllProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
        state.success = "Profiles fetched successfully."; // Set success message
      })
      .addCase(fetchAllProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null; // Clear success message on error
      })
      // Fetch profile by ID
      .addCase(fetchProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchProfileById.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.success = "Profile fetched successfully."; // Set success message
      })
      .addCase(fetchProfileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null; // Clear success message on error
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.profile = action.payload; // Update profile in state
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // delete Account
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.profile = null; // Clear the profile data after successful deletion
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { resetSuccess } = profileSlice.actions;
export default profileSlice.reducer;
