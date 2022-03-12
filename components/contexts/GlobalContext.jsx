import { createContext, useContext, useReducer } from "react";

const initialState = {
  showSidebar: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "toggle_sidebar":
      return { ...state, showSidebar: !state.showSidebar };
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
