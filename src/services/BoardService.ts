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
  /** Получить все доски */
  async getAllBoards(): Promise<IBoardSanitized[]> {
    const response = await this.get<{ data: IBoardSanitized[]; message: string; success: boolean }>('/boards');
    return response.data; // возвращаем только массив досок
  }
  /** Создать новую доску */
  createBoard(data: IBoardCreate): Promise<IBoardSanitized> {
    return this.post<IBoardSanitized>('/boards', data);
  }

  /** Получить все стикеры для доски */
  getStickyNotes(boardId: number): Promise<IStickyNoteSanitized[]> {
    return this.get<IStickyNoteSanitized[]>(`/boards/${boardId}/sticky-notes`);
  }

  /** Создать стикер на доске */
  createStickyNote(boardId: number, data: IStickyNoteCreate): Promise<IStickyNoteSanitized> {
    return this.post<IStickyNoteSanitized>(`/boards/${boardId}/sticky-notes`, data);
  }

  /** Обновить стикер */
  updateStickyNote(stickyNoteId: number, data: IStickyNoteUpdate): Promise<IStickyNoteSanitized> {
    return this.put<IStickyNoteSanitized>(`/sticky-notes/${stickyNoteId}`, data);
  }

  /** Переместить стикер на другую доску или позицию */
  moveStickyNote(stickyNoteId: number, boardId: number, positionX: number, positionY: number): Promise<IStickyNoteSanitized> {
    return this.patch<IStickyNoteSanitized>(`/sticky-notes/${stickyNoteId}/move`, {
      newBoardId: boardId,
      newPosition: { x: positionX, y: positionY },
    });
  }

  /** Удалить стикер */
  deleteStickyNote(stickyNoteId: number): Promise<void> {
    return this.delete<void>(`/sticky-notes/${stickyNoteId}`);
  }
}
