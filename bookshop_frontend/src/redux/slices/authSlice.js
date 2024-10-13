import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, logout, reAuth, register } from "../../api/auth.api";

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

export const logoutAuth = createAsyncThunk(
  "logout",
  async (userId, thunkAPI) => {
    try {
      await logout(userId); // Gọi hàm logout từ API
      return userId; // Trả về userId sau khi logout thành công
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
    // logoutAuth: (state, action) => {
    //   logout(action.payload.user._id);
    //   state.user = {};
    //   state.isAuthenticated = false;
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("refreshToken");
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAuth.fulfilled, (state, action) => {
        console.log(action.payload);
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(loginAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(reloginAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
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
        localStorage.setItem("refreshToken", "");
        console.log("false");
      })
      .addCase(loginAuth.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(logoutAuth.fulfilled, (state, action) => {
        state.user = {};
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      })
      .addCase(logoutAuth.rejected, (state, action) => {
        // Xử lý lỗi nếu cần
        console.error("Logout failed:", action.payload);
      });
  },
});

export default authSlice.reducer;
