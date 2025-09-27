import { create } from 'zustand';
import { BoardService } from '../services/BoardService';
import type {
  IBoardCreate,
  IBoardSanitized,
  IStickyNoteCreate,
  IStickyNoteUpdate,
  IStickyNoteSanitized,
} from '../types/board';

interface BoardState {
  // Состояние
  boards: IBoardSanitized[];
  currentBoard: IBoardSanitized | null;
  stickyNotes: IStickyNoteSanitized[];
  isLoading: boolean;
  error: string | null;
  
  // Действия
  setCurrentBoard: (board: IBoardSanitized | null) => void;
  fetchUserBoards: () => Promise<void>;
  fetchAllBoards: () => Promise<void>;
  createBoard: (data: IBoardCreate) => Promise<void>;
  fetchStickyNotes: (boardId: string) => Promise<void>;
  fetchPublicStickyNotes: (boardId: string) => Promise<void>;
  createStickyNote: (data: IStickyNoteCreate) => Promise<void>;
  updateStickyNote: (stickyNoteId: string, data: IStickyNoteUpdate) => Promise<void>;
  moveStickyNote: (stickyNoteId: string, boardId: string, positionX: number, positionY: number) => Promise<void>;
  deleteStickyNote: (stickyNoteId: string) => Promise<void>;
  clearError: () => void;
}

const boardService = new BoardService();

export const useBoardStore = create<BoardState>((set) => ({
  // Начальное состояние
  boards: [],
  currentBoard: null,
  stickyNotes: [],
  isLoading: false,
  error: null,

  // Действия
  setCurrentBoard: (board) => set({ currentBoard: board }),

  fetchUserBoards: async () => {
    set({ isLoading: true, error: null });
    try {
      const boards = await boardService.getUserBoards();
      set({ boards, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchAllBoards: async () => {
    set({ isLoading: true, error: null });
    try {
      const boards = await boardService.getAllBoards();
      set({ boards, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createBoard: async (data: IBoardCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newBoard = await boardService.createBoard(data);
      set(state => ({ 
        boards: [...state.boards, newBoard],
        currentBoard: newBoard,
        isLoading: false 
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchStickyNotes: async (boardId: string) => {
    set({ isLoading: true, error: null });
    try {
      const stickyNotes = await boardService.getStickyNotes(boardId);
      set({ stickyNotes, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchPublicStickyNotes: async (boardId: string) => {
    set({ isLoading: true, error: null });
    try {
      const stickyNotes = await boardService.getPublicStickyNotes(boardId);
      
      set({ stickyNotes, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createStickyNote: async (data: IStickyNoteCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newSticky = await boardService.createStickyNote(data.boardId, data);
      set(state => ({ 
        stickyNotes: [...state.stickyNotes, newSticky],
        isLoading: false 
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateStickyNote: async (stickyNoteId: string, data: IStickyNoteUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSticky = await boardService.updateStickyNote(stickyNoteId, data);
      set(state => ({
        stickyNotes: state.stickyNotes.map(sticky =>
          sticky.id === stickyNoteId ? updatedSticky : sticky
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  moveStickyNote: async (stickyNoteId: string, boardId: string, positionX: number, positionY: number) => {
    set({ isLoading: true, error: null });
    try {
      const movedSticky = await boardService.moveStickyNote(stickyNoteId, boardId, positionX, positionY);
      set(state => ({
        stickyNotes: state.stickyNotes.map(sticky =>
          sticky.id === stickyNoteId ? movedSticky : sticky
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteStickyNote: async (stickyNoteId: string) => {
    set({ isLoading: true, error: null });
    try {
      await boardService.deleteStickyNote(stickyNoteId);
      set(state => ({
        stickyNotes: state.stickyNotes.filter(sticky => sticky.id !== stickyNoteId),
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
