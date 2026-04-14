import type { AxiosError, AxiosResponse } from "axios";
import type { ApiResponse } from "../types/apiType";
import apiClient from "./apiClient";
import axios from "axios";
import type { challengeSessionStateType, stageStateType } from "../types/stageType";
import type { challengeStageType } from "../types/challengeType";

export const getStagesList = async (): Promise<ApiResponse<stageStateType[]>> => {
    try{
        const response: AxiosResponse = await apiClient.get(`/challenge/stages-list`);
        const result = response.data;
        return {
            status: result.status,
            success: result.success ?? true,
            message: result.message,
            data: result.data,
        };
    }catch(error){
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
                error: axiosError.message || 'Server không phản hồi',
            };
        }
        return {
            success: false,
            error: (error as Error).message || 'Đã xảy ra lỗi không xác định',
        };
    }
}

export const getState = async (userId: string): Promise<ApiResponse<challengeSessionStateType>> => {
    try{
        const response: AxiosResponse = await apiClient.get(`/challenge/session-state/${userId}`);
        const result = response.data;
        return {
            status: result.status,
            success: result.success ?? true,
            message: result.message,
            data: result.data,
        };
    }catch(error){
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
                error: axiosError.message || 'Server không phản hồi',
            };
        }
        return {
            success: false,
            error: (error as Error).message || 'Đã xảy ra lỗi không xác định',
        };
    }
}

export const getActivities = async (progressId: string): Promise<ApiResponse<challengeStageType>> => {
    try{
        const response: AxiosResponse = await apiClient.get(`/challenge/escalation/${progressId}`);
        const result = response.data;
        return {
            status: result.status,
            success: result.success ?? true,
            message: result.message,
            data: result.data,
        };
    }catch(error){
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
                error: axiosError.message || 'Server không phản hồi',
            };
        }
        return {
            success: false,
            error: (error as Error).message || 'Đã xảy ra lỗi không xác định',
        };
    }
}

export const submitChallenge =  async (payload: any): Promise<ApiResponse<any>> => {
    try{
        const response: AxiosResponse = await apiClient.post(`/challenge/submit`, payload);
        const result = response.data;
        return {
            status: result.status,
            success: result.success ?? true,
            message: result.message,
            data: result.data,
        };
    }catch(error){
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
                error: axiosError.message || 'Server không phản hồi',
            };
        }
        return {
            success: false,
            error: (error as Error).message || 'Đã xảy ra lỗi không xác định',
        };
    }
}