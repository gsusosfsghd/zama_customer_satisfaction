"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import {
  GenericStringInMemoryStorage,
  GenericStringStorage,
} from "@/fhevm/GenericStringStorage";

interface UseInMemoryStorageState {
  storage: GenericStringStorage;
}

interface InMemoryStorageProviderProps {
  children: ReactNode;
}

const InMemoryStorageContext = createContext<
  UseInMemoryStorageState | undefined
>(undefined);

export const useInMemoryStorage = () => {
  const context = useContext(InMemoryStorageContext);
  if (!context) {
    // During SSR/static export or if Provider not yet initialized, return a safe default
    // This allows hooks to work during initial render before Provider is ready
    return { storage: new GenericStringInMemoryStorage() };
  }
  return context;
};

export const InMemoryStorageProvider: React.FC<
  InMemoryStorageProviderProps
> = ({ children }) => {
  const [storage] = useState<GenericStringStorage>(
    new GenericStringInMemoryStorage()
  );
  return (
    <InMemoryStorageContext.Provider value={{ storage }}>
      {children}
    </InMemoryStorageContext.Provider>
  );
};

