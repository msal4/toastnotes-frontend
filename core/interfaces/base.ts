export interface Base {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T extends Base> {
  total: number;
  result: T[];
}
