import { createContext } from "react";
import { FormContextType } from "../domain/interfaces/FormContextInterface";

export const FormContext = createContext<FormContextType>({
  showForm: false,
  setShowForm: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  userData: { name: "", address: "" },
  setUserData: () => {},
});

export default FormContext;
