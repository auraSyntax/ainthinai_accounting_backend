export declare class PaginatedResponseDto<T> {
    totalItems: number;
    data: T[];
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
