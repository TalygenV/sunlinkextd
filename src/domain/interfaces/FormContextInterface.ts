import { Dispatch, SetStateAction } from "react";
import { UserData } from "./UserDataInterface";

export interface FormContextType {
  showForm: boolean;
  setShowForm: Dispatch<SetStateAction<boolean>>;
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  userData: UserData;
  setUserData: Dispatch<SetStateAction<UserData>>;
}
