import { BaseApiService } from './BaseApiService';
import type {
  IBoardCreate,
  IBoardSanitized,
  IStickyNoteCreate,
  IStickyNoteUpdate,
  IStickyNoteSanitized,
} from '../types/board';
import { API_BASE_URL } from '../config/apiConfig';

export class BoardService extends BaseApiService {
   constructor() {
    super({
        baseURL: API_BASE_URL,
        getToken: () => localStorage.getItem('authToken'),
        enableLogging: true,
    });
  }
  /** Получить все доски авторизованного пользователя */
  async getUserBoards(): Promise<IBoardSanitized[]> {
    const response = await this.get<{ data: IBoardSanitized[]; message: string; success: boolean }>('/boards');
    return response.data; // возвращаем только массив досок
  }
    /** Получить все доски всех пользователей */
  async getAllBoards(): Promise<IBoardSanitized[]> {
    const response = await this.get<{ data: IBoardSanitized[]; message: string; success: boolean }>('/boards/all');
    console.log(response.data);
    
    return response.data;
  }
  /** Создать новую доску */
  async createBoard(data: IBoardCreate): Promise<IBoardSanitized> {
    return this.post<IBoardSanitized>('/boards', data);
  }

  /** Получить все стикеры для доски */
  async getStickyNotes(boardId: string): Promise<IStickyNoteSanitized[]> {
    const response = await this.get<{ data: { board: IBoardSanitized, stickyNotes: IStickyNoteSanitized[] }; message: string; success: boolean }>(`/boards/${boardId}/sticky-notes`);
    return response.data.stickyNotes
  }

  async getPublicStickyNotes(boardId: string): Promise<IStickyNoteSanitized[]> {
    const response = await this.get<{  data: { board: IBoardSanitized, stickyNotes: IStickyNoteSanitized[] }; message: string; success: boolean }>(`/boards/${boardId}/all/sticky-notes`);    
    return response.data.stickyNotes
  }


  /** Создать стикер на доске */
  createStickyNote(boardId: string, data: IStickyNoteCreate): Promise<IStickyNoteSanitized> {
    return this.post<IStickyNoteSanitized>(`/boards/${boardId}/sticky-notes`, data);
  }

  /** Обновить стикер */
  async updateStickyNote(stickyNoteId: string, data: IStickyNoteUpdate): Promise<IStickyNoteSanitized> {
    const response = await this.put<{ data: IStickyNoteSanitized; message: string; success: boolean }>(`/sticky-notes/${stickyNoteId}`, data)
    return response.data;
  }

  /** Переместить стикер на другую доску или позицию */
  moveStickyNote(stickyNoteId: string, boardId: string, positionX: number, positionY: number): Promise<IStickyNoteSanitized> {
    return this.patch<IStickyNoteSanitized>(`/sticky-notes/${stickyNoteId}/move`, {
      newBoardId: boardId,
      newPosition: { x: positionX, y: positionY },
    });
  }

  /** Удалить стикер */
  deleteStickyNote(stickyNoteId: string): Promise<void> {
    return this.delete<void>(`/sticky-notes/${stickyNoteId}`);
  }
}
