import { Request } from 'express';
import { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ProductFilterQuery extends PaginationQuery {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  brand?: string;
  rating?: string;
}

export interface OrderFilterQuery extends PaginationQuery {
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
