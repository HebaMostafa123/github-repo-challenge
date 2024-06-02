import create from 'zustand';

interface KeywordStore {
  keyword: string;
  setKeyword: (keyword: string) => void;
}

const useKeywordStore = create<KeywordStore>((set) => ({
  keyword: '',
  setKeyword: (keyword) => set({ keyword }),
}));

export default useKeywordStore;