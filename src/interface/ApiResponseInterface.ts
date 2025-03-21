export default interface ApiResponse<T> {
    status: number;
    message: string | null;
    data: T;
  }