interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
    totalRecords?:number;
}