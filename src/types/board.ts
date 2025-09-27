export interface IStickyNote {
  id: string;
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
  boardId: string;
}

export interface IStickyNoteUpdate {
  title?: string;
  content?: string;
  color?: string;
  positionX?: number;
  positionY?: number;
}

export interface IStickyNoteSanitized {
  id: string;
  title: string;
  content?: string;
  color?: string;
  positionX: number;
  positionY: number;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBoard {
  id: string;
  title: string;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBoardCreate {
  title: string;
  description?: string;
  userId: string;
}

export interface IBoardSanitized {
  id: string;
  title: string;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
