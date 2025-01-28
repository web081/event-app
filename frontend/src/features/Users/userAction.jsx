import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import backendURL from "../../config";

// Define the async action to fetch all profiles
export const fetchAllProfiles = createAsyncThunk(
  "profiles/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendURL}/api/Users`);
      return response.data;
    } catch (error) {
      console.error("Fetch all profiles error:", error.message);
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

export const fetchProfileById = createAsyncThunk(
  "profiles/fetchById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendURL}/api/Users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Fetch profile by ID error:", error.message);
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profiles/updateProfile",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      // Validate password if provided
      const password = formData.get("password");
      if (password && password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      const response = await axios.put(
        `${backendURL}/api/Users/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "profiles/deleteProfile",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.delete(
        `    ${backendURL}/api/Delete/${userId}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
