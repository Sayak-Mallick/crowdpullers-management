export interface Events {
  _id: number;
  title: string;
  description: string;
  year: number;
  month: number;
  location: string;
  organization: string;
  category: string;
  image: string;
}

/**
 * Generic wrapper for any paginated API response.
 *
 * `T` is the shape of a single document (e.g. `Events`).
 */
export interface PaginatedResponse<T> {
  /** The slice of documents for the current page */
  data: T[];
  pagination: {
    /** Current page number (1-indexed) */
    page: number;
    /** Max documents per page */
    limit: number;
    /** Total matching documents in the collection */
    totalDocs: number;
    /** Total number of pages */
    totalPages: number;
    /** Whether a next page exists */
    hasNextPage: boolean;
    /** Whether a previous page exists */
    hasPrevPage: boolean;
  };
}
