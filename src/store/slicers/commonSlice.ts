import { createSlice } from "@reduxjs/toolkit";

export enum ViewState {
    main,
    addAccount,
    addSource,
    editSource,
    //addProxy,
    addProxies,
    editAccount,
    cashout,
    cashoutHistory,
}

type CommonState = {
    viewState: ViewState;
}

const initialState = {
    viewState: ViewState.main
}

const commonStateSlice = createSlice({
    name: "commonState",
    initialState,
    reducers: {
        setView(state: CommonState, action: { type: string; payload: ViewState }) {
            state.viewState = action.payload;
        },
    },
});

export const { setView } = commonStateSlice.actions;
export default commonStateSlice.reducer;
