
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const API_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '30000');

export interface ApiErrorResponse {
  error: string;
  status: number;
  message?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiErrorResponse;
  status: number;
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = API_URL, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        method: 'GET',
        signal: this.getAbortSignal(),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: this.getAbortSignal(),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  private getAbortSignal(): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), this.timeout);
    return controller.signal;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    let data: unknown;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorData = typeof data === 'object' ? (data as Record<string, unknown>) : {};
      const message = typeof errorData.message === 'string' ? errorData.message : String(data);
      return {
        status: response.status,
        error: {
          error: 'API_ERROR',
          status: response.status,
          message,
        },
      };
    }

    return {
      data: data as T,
      status: response.status,
    };
  }

  private handleError<T>(error: unknown): ApiResponse<T> {
    console.error('API Error:', error);
    return {
      status: 0,
      error: {
        error: 'NETWORK_ERROR',
        status: 0,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

export const apiClient = new ApiClient();
