import axios from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios';

export interface ApiServiceOptions {
  baseURL: string;
  getToken?: () => string | null;  
  onUnauthorized?: () => void;    
  enableLogging?: boolean;            
}

export abstract class BaseApiService {
  protected readonly instance: AxiosInstance;
  private readonly getToken?: () => string | null;
  private readonly onUnauthorized?: () => void;
  private readonly enableLogging: boolean;

  constructor(options: ApiServiceOptions) {
    this.instance = axios.create({
      baseURL: options.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.getToken = options.getToken;
    this.onUnauthorized = options.onUnauthorized;
    this.enableLogging = options.enableLogging ?? false;

    this.setupInterceptors();
  }

  /** Настраиваем request/response interceptors */
  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => this.handleRequest(config),
      (error: AxiosError) => this.handleRequestError(error)
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => this.handleResponse(response),
      (error: AxiosError) => this.handleResponseError(error)
    );
  }

  /** Обработка исходящего запроса */
  protected handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const token = this.getToken?.();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (this.enableLogging) {
      // console.log(`[API] ${config.method?.toUpperCase()} → ${config.url}`);
    }

    return config;
  }

  /** Ошибка при формировании запроса */
  protected handleRequestError(error: AxiosError): Promise<AxiosError> {
    if (this.enableLogging) {
      console.error('Request error:', error);
    }
    return Promise.reject(error);
  }

  /** Обработка ответа */
  protected handleResponse<T>(response: AxiosResponse<T>): AxiosResponse<T> {
    if (this.enableLogging) {
      // console.log(`[API] Response ${response.status}:`, response.data);
    }
    return response;
  }

  /** Обработка ошибок ответа */
  protected handleResponseError(error: AxiosError): Promise<AxiosError> {
    if (this.enableLogging) {
      console.error('Response error:', error);
    }

    if (error.response?.status === 401 && this.onUnauthorized) {
      this.onUnauthorized();
    }

    return Promise.reject(error);
  }

  /** GET запрос */
  protected async get<T>(
    url: string,
    config?: AxiosRequestConfig,
    signal?: AbortSignal
  ): Promise<T> {
    const response = await this.instance.get<T>(url, { ...config, signal });
    return response.data;
  }

  /** POST запрос */
  protected async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
    signal?: AbortSignal
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, { ...config, signal });
    return response.data;
  }

  /** PUT запрос */
  protected async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
    signal?: AbortSignal
  ): Promise<T> {
    const response = await this.instance.put<T>(url, data, { ...config, signal });
    return response.data;
  }

  /** PATCH запрос */
  protected async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
    signal?: AbortSignal
  ): Promise<T> {
    const response = await this.instance.patch<T>(url, data, { ...config, signal });
    return response.data;
  }

  /** DELETE запрос */
  protected async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
    signal?: AbortSignal
  ): Promise<T> {
    const response = await this.instance.delete<T>(url, { ...config, signal });
    return response.data;
  }

  /** Изменить базовый URL */
  public setBaseURL(baseURL: string): void {
    this.instance.defaults.baseURL = baseURL;
  }

  /** Установить заголовок */
  public setHeader(key: string, value: string): void {
    this.instance.defaults.headers.common[key] = value;
  }

  /** Удалить заголовок */
  public removeHeader(key: string): void {
    delete this.instance.defaults.headers.common[key];
  }
}
