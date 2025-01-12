import { create } from 'zustand';

const useStore = create((set: any) => ({
    loginResponse: null,
    setLoginResponse: ((login: any) => set({ loginResponse: login })),
    user: null,
    isLoggedIn: false,
    setUser: (user: any) => set({ user, isLoggedIn: true }),
    logout: () => set({ user: null, isLoggedIn: false }),
}));

export default useStore;