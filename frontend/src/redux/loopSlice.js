import { createSlice } from "@reduxjs/toolkit";

const loopSlice = createSlice({
  name: "loop",
  initialState: {
    loopData: [],
  },
  reducers: {
    /* Replace all loops (initial fetch) */
    setLoopData: (state, action) => {
      state.loopData = action.payload;
    },

    /* Add new loop (upload) */
    addLoop: (state, action) => {
      state.loopData.unshift(action.payload);
    },

    /* Update single loop (like / comment / socket) */
    updateLoop: (state, action) => {
      const updatedLoop = action.payload;
      const index = state.loopData.findIndex(
        (l) => l._id === updatedLoop._id
      );

      if (index !== -1) {
        state.loopData[index] = updatedLoop;
      }
    },

    /* Reset on logout */
    resetLoops: (state) => {
      state.loopData = [];
    },
  },
});

export const {
  setLoopData,
  addLoop,
  updateLoop,
  resetLoops,
} = loopSlice.actions;

export default loopSlice.reducer;
