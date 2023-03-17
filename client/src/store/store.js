import { create } from "zustand";

export const useAuthstore = create((set) => ({
  auth: {
    username: '',
    active: false
  },
  setusername: (name) => set((state) => ({ auth: {...state.auth, username : name} })),
}));
