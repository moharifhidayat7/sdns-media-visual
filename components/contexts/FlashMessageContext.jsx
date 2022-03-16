import { createContext, useState, useContext } from "react";
const FlashMessageContext = createContext();
export const FlashMessageContextProvider = ({ children }) => {
   const [flashMessage, setFlashMessage] = useState({
      show: false,
      message: "",
      type: "success",
      timeOut: 5000,
   });

   return (
      <FlashMessageContext.Provider
         value={{
            flashMessage, setFlashMessage
         }}
      >
         {children}
      </FlashMessageContext.Provider>
   );
};
export const useFlashMessageContext = () => {
   return useContext(FlashMessageContext);
}