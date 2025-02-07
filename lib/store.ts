import create from 'zustand';
import { DataItem } from '../types';

interface LocationState {
  selectedIl: string;
  selectedIlce: string;
  selectedMahalle: string;
  setSelectedIl: (il: string) => void;
  setSelectedIlce: (ilce: string) => void;
  setSelectedMahalle: (mahalle: string) => void;
  resetSelections: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  selectedIl: '',
  selectedIlce: '',
  selectedMahalle: '',
  setSelectedIl: (il) => set({ selectedIl: il, selectedIlce: '', selectedMahalle: '' }),
  setSelectedIlce: (ilce) => set({ selectedIlce: ilce, selectedMahalle: '' }),
  setSelectedMahalle: (mahalle) => set({ selectedMahalle: mahalle }),
  resetSelections: () => set({ selectedIl: '', selectedIlce: '', selectedMahalle: '' }),
}));

interface CommentState {
  comments: Array<{
    id: string;
    text: string;
    likes: number;
    createdAt: Date;
    userId: string;
    replies: Array<{
      id: string;
      text: string;
      createdAt: Date;
      userId: string;
    }>;
  }>;
  addComment: (text: string, userId: string) => void;
  addReply: (commentId: string, text: string, userId: string) => void;
  updateLikes: (commentId: string, increment: boolean) => void;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: [],
  addComment: (text, userId) =>
    set((state) => ({
      comments: [
        ...state.comments,
        {
          id: Date.now().toString(),
          text,
          likes: 0,
          createdAt: new Date(),
          userId,
          replies: [],
        },
      ],
    })),
  addReply: (commentId, text, userId) =>
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  id: Date.now().toString(),
                  text,
                  createdAt: new Date(),
                  userId,
                },
              ],
            }
          : comment
      ),
    })),
  updateLikes: (commentId, increment) =>
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + (increment ? 1 : -1) }
          : comment
      ),
    })),
})); 