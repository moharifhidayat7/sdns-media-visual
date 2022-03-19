import { createContext, useContext, useReducer } from "react";

const initialState = {
  showSidebar: false,
  data: [
  ],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "toggle_sidebar":
      return { ...state, showSidebar: !state.showSidebar };
    case "set_data":
      return { ...state, data: action.payload };
    case "delete":
      const result=state.data.result.filter((item) => item.id !== action.payload);
      const total=state.data.total-1;
      return {
        ...state,
        data:  {...state.data,total,result:[...result]} ,
      };
    case "delete_many":
      const resultMany=state.data.result.filter((d) => !action.payload.includes(d.id))
      const totalMany=state.data.total-1;
      return {
        ...state,
        data: {...state.data,total:totalMany,result:[...resultMany]} ,
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
