import { AxiosRequestConfig } from 'axios';

export interface AxiosRequestConfigExt extends AxiosRequestConfig {
  _retry?: boolean;
  headers: Record<string, string>;
}
