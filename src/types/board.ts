export interface IStickyNote {
  id: number;
  title: string;
  content?: string;
  color?: string;
  positionX: number;
  positionY: number;
  boardId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStickyNoteCreate {
  title: string;
  content?: string;
  color?: string;
  positionX?: number;
  positionY?: number;
  boardId: number;
}

export interface IStickyNoteUpdate {
  title?: string;
  content?: string;
  color?: string;
  positionX?: number;
  positionY?: number;
}

export interface IStickyNoteSanitized {
  id: number;
  title: string;
  content?: string;
  color?: string;
  positionX: number;
  positionY: number;
  boardId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBoard {
  id: number;
  title: string;
  description?: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBoardCreate {
  title: string;
  description?: string;
  userId: number;
}

export interface IBoardSanitized {
  id: number;
  title: string;
  description?: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
