import { create } from 'zustand'

export const useScriptsStore = create((set) => ({
  scripts: [],
  setScripts: (scripts) => set({ scripts })
}))

export default useScriptsStore
