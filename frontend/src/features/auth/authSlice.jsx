import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  registerAdmin,
  verifyAdminOTP,
} from "./authActions";

const storedUserInfo = localStorage.getItem("userInfo");

const initialState = {
  email: "",
  loading: false,
  userInfo: storedUserInfo ? JSON.parse(storedUserInfo) : null,
  error: null,
  success: false,
  isOtpRequired: false,
  tempUserId: null,
  tempAdminData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    logoutUser: (state) => {
      state.userInfo = null;
      state.isOtpRequired = false;
      state.tempAdminData = null;
      state.tempUserId = null;
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
    },
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.userInfo = {
        ...user,
        token,
      };
      state.loading = false;
      state.success = true;
      state.error = null;

      // Store normalized data
      localStorage.setItem("userToken", token);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...user,
          token,
        })
      );
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    resetError: (state) => {
      state.error = null; // Reset the error to null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.requireOTP) {
          // For admin users requiring OTP
          state.isOtpRequired = true;
          state.tempUserId = action.payload.user._id;
          state.tempAdminData = action.payload.user;
          // Don't set userInfo or store in localStorage yet
        } else {
          // Regular user login
          state.userInfo = {
            ...action.payload.user,
            token: action.payload.token,
          };
          state.success = true;
          localStorage.setItem("userToken", action.payload.token);
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              ...action.payload.user,
              token: action.payload.token,
            })
          );
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // OTP verification cases
      .addCase(verifyAdminOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyAdminOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.isOtpRequired = false;

        const userWithToken = {
          ...action.payload.user,
          token: action.payload.token,
        };

        // Only set userInfo and localStorage after successful OTP verification
        state.userInfo = userWithToken;
        state.success = true;
        state.tempAdminData = null;
        state.tempUserId = null;

        localStorage.setItem("userToken", action.payload.token);
        localStorage.setItem("userInfo", JSON.stringify(userWithToken));
      })
      .addCase(verifyAdminOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Registration cases remain the same
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        // Remove setting userInfo on registration
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser, setCredentials, resetSuccess, resetError } =
  authSlice.actions;

export default authSlice.reducer;
