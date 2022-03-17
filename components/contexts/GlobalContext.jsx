import { createContext, useContext, useReducer } from "react";

const initialState = {
  showSidebar: false,
  data: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "toggle_sidebar":
      return { ...state, showSidebar: !state.showSidebar };
    case "set_data":
      return { ...state, data: action.payload };
    case "delete":
      return {
        ...state,
        data: state.data.filter((d) => d.id != action.payload),
      };
    case "delete_many":
      return {
        ...state,
        data: state.data.filter((d) => !action.payload.includes(d.id)),
      };
    default:
      return state;
  }
};

const GlobalContext = createContext();

export function GlobalContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <GlobalContext.Provider value={[state, dispatch]}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  return useContext(GlobalContext);
}
