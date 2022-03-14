import { createContext, useContext, useReducer } from "react";

const initialState = {
  showFilter: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "toggle_filter":
      return { ...state, showFilter: !state.showFilter };
    default:
      return state;
  }
};

const DataTableContext = createContext();

export function DataTableProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DataTableContext.Provider value={[state, dispatch]}>
      {children}
    </DataTableContext.Provider>
  );
}

export function useDataTableContext() {
  return useContext(DataTableContext);
}
