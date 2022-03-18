import { createContext, useContext, useReducer } from "react";
import { useDebouncedValue } from "@mantine/hooks";

const initialState = {
  name: "tes",
  showFilter: false,
  selection: [],
  withSelection: false,
  withAction: false,
  search: "",
  sortBy: "",
  loading: false,
  reverseSortDirection: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "toggle_filter":
      return { ...state, showFilter: !state.showFilter };
    case "set":
      return { ...state, ...action.payload };
    case "reverse_sort_direction":
      return { ...state, reverseSortDirection: !state.reverseSortDirection };
    case "toogle_row":
      return {
        ...state,
        selection: state.selection.includes(action.payload)
          ? state.selection.filter((item) => item !== action.payload)
          : [...state.selection, action.payload],
      };
    case "toggle_all":
      return {
        ...state,
        selection:
          action.payload.length === state.selection.length
            ? []
            : action.payload.map((item) => item.id),
      };
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
