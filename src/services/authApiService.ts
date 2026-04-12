import type { ApiResponse } from "../types/apiType";
import type { RegisterPayload, UserGeneralDto } from "../types/authType";
import axios, { AxiosError, type AxiosResponse } from "axios";
import apiClient from "./apiClient";

export const registerUser = async (payload: RegisterPayload): Promise<ApiResponse> => {
    try {
        const formData = new FormData();
        formData.append('username', payload.username.trim());
        formData.append('passwords', payload.passwords);
        formData.append('firstName', payload.firstName.trim());
        formData.append('lastName', payload.lastName.trim());

        if (payload.avatar) {
            formData.append('avatar', payload.avatar);
        }
        const response: AxiosResponse = await apiClient.post('/users', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const result = response.data;

        return {
            success: result.success ?? true,
            message: result.message || 'Đăng ký tài khoản thành công',
            data: result.data,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;

            if (axiosError.response?.data) {
                const serverData = axiosError.response.data as any;

                return {
                    success: false,
                    error:
                        serverData.message ||
                        serverData.error ||
                        `Lỗi ${axiosError.response.status}: ${axiosError.response.statusText}`,
                };
            }

            return {
                success: false,
                error: axiosError.message || 'Không thể kết nối đến server',
            };
        }

        return {
            success: false,
            error: (error as Error).message || 'Đã xảy ra lỗi không xác định',
        };
    }
};

export const loginUser = async (credentials: { username: string; passwords: string }) => {
    try {
        console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
        const response = await apiClient.post('/users/login', {
            username: credentials.username.trim(),
            passwords: credentials.passwords,
        });

        const result = response.data;

        if (response.status === 200 && result.data) {
            return {
                success: true,
                message: result.message || 'Đăng nhập thành công!',
                data: { token: result.data },
            };
        }

        return {
            success: false,
            error: result.message || 'Đăng nhập thất bại',
        };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
            const serverData = error.response.data as any;
            return {
                success: false,
                error: serverData.message || serverData.error || `Lỗi ${error.response.status}`,
            };
        }
        return {
            success: false,
            error: (error as Error).message || 'Không thể kết nối server',
        };
    }
};

export const verifyToken = async (token: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get('/users/token-verify', {
        params: { tk: token },  // query param ?tk=...
      });
  
      const result = response.data;
  
      if (response.status === 200 && result.data) {
        return {
          success: true,
          message: result.message || 'Token hợp lệ',
          data: result.data,  // { firstname, lastname, id, username, role }
        };
      }
  
      return {
        success: false,
        error: result.message || 'Token không hợp lệ',
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const serverData = error.response.data as any;
        return {
          success: false,
          error: serverData.message || serverData.error || `Lỗi ${error.response.status}`,
        };
      }
      return {
        success: false,
        error: (error as Error).message || 'Không thể kết nối server',
      };
    }
};

export const getUserState = async (userId: string): Promise<ApiResponse<UserGeneralDto>> => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
  
      const result = response.data;
  
      if (response.status === 200 && result.data) {
        return {
          success: true,
          message: result.message || 'dữ liệu hợp lệ',
          data: result.data,
        };
      }
  
      return {
        success: false,
        error: result.message || 'dữ liệu không hợp lệ',
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const serverData = error.response.data as any;
        return {
          success: false,
          error: serverData.message || serverData.error || `Lỗi ${error.response.status}`,
        };
      }
      return {
        success: false,
        error: (error as Error).message || 'Không thể kết nối server',
      };
    }
};
