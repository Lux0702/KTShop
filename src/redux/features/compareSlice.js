import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage, setLocalStorage } from "@/utils/localstorage";
import { notifyError, notifySuccess } from "@/utils/toast";

const initialState = {
  compareItems: [],
};

export const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    add_to_compare: (state, { payload }) => {
      console.log("Adding to compare:", state.compareItems, payload);
      const isExist = state.compareItems.some(
        (item) => item.id === payload.id
      );
      if (!isExist) {
        state.compareItems.push(payload);
        notifySuccess(`${payload.title} added to compare`);
      } else {
        state.compareItems = state.compareItems.filter(
          (item) => item.id !== payload.id
        );
        notifyError(`${payload.title} removed from compare`);
      }
      setLocalStorage("compare_items", state.compareItems);
    },
    remove_compare_product: (state, { payload }) => {
      state.compareItems = state.compareItems.filter(
        (item) => item.id !== payload.id
      );
      setLocalStorage("compare_items", state.compareItems);
      notifyError(`${payload.title} removed from compare`);
    },
    get_compare_products: (state, { payload }) => {
      state.compareItems = getLocalStorage("compare_items");
    },
  },
});

export const { add_to_compare, get_compare_products, remove_compare_product } =
  compareSlice.actions;
export default compareSlice.reducer;
