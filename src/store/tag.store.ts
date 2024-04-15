import create, { State } from 'zustand';

type TagState = {
  tags: string[];
  addTag: (tag: string) => void;
  deleteTag: (index: number) => void;
  updatedTag: (tag: string, index: number) => void;
  setTags: (tags: string[]) => void;
};

export const useTagStore = create<TagState>((set) => ({
  tags: [],
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  deleteTag: (index) => set((state) => ({ tags: state.tags.filter((_, i) => i !== index) })),
  updatedTag: (tag, index) => set((state) => ({
    tags: state.tags.map((current, i) => (i === index ? tag : current)),
  })),
  setTags: (tags) => set({ tags }),
}));
