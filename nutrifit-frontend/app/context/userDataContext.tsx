import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserDataType = {
  preferredName: string;
  primaryGoal: string;
  secondaryGoal: string;
  age: number | null;
  gender: number | null;  // 0 for Male, 1 for Female
  height: number | null;
  weight: number | null;
  activityLevel: number | null;  // 1-5 for activity levels
  email: string;
  password: string;
};

type UserDataContextType = {
  userData: UserDataType;
  setUserData: React.Dispatch<React.SetStateAction<UserDataType>>;
};

const defaultUserData: UserDataType = {
  preferredName: '',
  primaryGoal: '',
  secondaryGoal: '',
  age: null,
  gender: null,
  height: null,
  weight: null,
  activityLevel: null,
  email: '',
  password: '',
};

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserDataType>(defaultUserData);

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};