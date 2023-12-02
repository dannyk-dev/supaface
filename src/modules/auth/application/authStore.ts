import { createContext, useContext } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  NextOrObserver,
  signOut,
} from "firebase/auth";
import { createStore, useStore } from "zustand";

import { IUser } from "../types";
import { ICredentials, loginUser } from "../infrastructure/loginUser";

const isLoggedIn = () => {
  const auth = getAuth();
  return !!auth.currentUser;
};

interface IStore {
  isAuthenticated: boolean;
  isError: boolean;
  state: "idle" | "loading" | "finished";
  user: IUser;
  login: (credentials: ICredentials) => Promise<void>;
  logout: () => Promise<void>;
  createAccount: (email: string, password: string) => Promise<void>;
  destroy: () => void;
}

export type AuthStore = ReturnType<typeof initializeAuthStore>;
const zustandContext = createContext<AuthStore | null>(null);
export const Provider = zustandContext.Provider;

export const useAuthStore = <T>(selector: (state: IStore) => T) => {
  const store = useContext(zustandContext);

  if (!store) throw new Error("AuthStore is missing the provider");

  return useStore(store, selector);
};

export const initializeAuthStore = (preloadedState: Partial<IStore> = {}) => {
  return createStore<IStore>((set, get) => {
    const auth = getAuth();

    const handleAuthChange: NextOrObserver<IUser> = (user: IUser | null) => {
      if (user) {
        set({
          user,
          isAuthenticated: true,
          state: "finished",
        });
      } else {
        set({
          isError: true,
          state: "finished",
        });
      }
    };

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, handleAuthChange);

    // Check if the user is already logged in
    if (isLoggedIn()) {
      set({ state: "loading" });
    } else {
      set({ state: "finished" });
    }

    return {
      isAuthenticated: isLoggedIn(),
      isError: false,
      state: "idle",
      user: undefined as unknown as IUser,
      ...preloadedState,

      login: async (credentials: ICredentials): Promise<void> => {
        try {
          set({ state: "loading" });

          const loggedInUser = await loginUser(credentials);

          set({
            user: loggedInUser as IUser,
            isAuthenticated: true,
            state: "finished",
          });
        } catch (error) {
          console.error("Error!! ", error);
          set({
            isError: true,
            state: "finished",
          });

          throw error;
        }
      },

      logout: async (): Promise<void> => {
        try {
          set({ state: "loading" });

          await signOut(auth);

          set({
            isAuthenticated: false,
            user: {} as IUser,
            state: "finished",
          });
        } catch (error) {
          console.error(error);
          set({
            isError: true,
            state: "finished",
          });

          throw error;
        }
      },

      createAccount: async (
        e_mail: string,
        password: string
      ): Promise<void> => {
        set({ state: "loading" });

        try {
          // Create a new user account using Firebase Auth
          const credential = await createUserWithEmailAndPassword(
            auth,
            e_mail,
            password
          );

          set({
            user: credential.user,
            isAuthenticated: true,
            state: "finished",
          });
        } catch (e) {
          set({
            isError: true,
            state: "finished",
          });

          throw e;
        }
      },

      destroy: () => {
        // Clean up the subscription when the store is destroyed
        unsubscribe();
      },
    };
  });
};
