import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, reAuth, register } from "../../api/auth.api";

export const loginAuth = createAsyncThunk("login", async (body, thunkAPI) => {
  try {
    const response = await login(body);
    const data = response.data;
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || error?.message
    );
  }
});

export const reloginAuth = createAsyncThunk(
  "reauth",
  async (body, thunkAPI) => {
    try {
      const response = await reAuth(body);
      const data = response.data;
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error?.message
      );
    }
  }
);

export const registerAuth = createAsyncThunk(
  "register",
  async (body, thunkAPI) => {
    try {
      const response = await register(body);
      const data = response.data;
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error?.message
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
    isAuthenticated: false,
    loading: true,
  },
  reducers: {
    logoutAuth: (state, action) => {
      state.user = {};
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(reloginAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerAuth.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginAuth.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(reloginAuth.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(registerAuth.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(reloginAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = {};
        localStorage.setItem("token", "");
        console.log("false");
      })
      .addCase(loginAuth.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default authSlice.reducer;

export const { logoutAuth } = authSlice.actions;
