import type { AxiosError, AxiosResponse } from "axios";
import type { ApiResponse } from "../types/apiType";
import apiClient from "./apiClient";
import axios from "axios";
import type { QuestStatusDto, topicGeneralType } from "../types/topicType";
import type { Quest } from "../types/questType";

export const getTopic = async (id:string): Promise<ApiResponse<topicGeneralType>> => {
    try{
        const response: AxiosResponse = await apiClient.get(`/topics/${id}`);
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

export const getTopics = async (): Promise<ApiResponse<topicGeneralType[]>> => {
    try{
        const response: AxiosResponse = await apiClient.get("/topics");
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
};

export const getTopicById = async (id:string,userId:string): Promise<ApiResponse<QuestStatusDto[]>>=>{
    try{
        const response: AxiosResponse = await apiClient.get(`/topics/${id}/quests-status?userId=${userId}`);
        console.log(`/topics/${id}/quests-status?userId=${userId}`)
        const result = response.data;

        return {
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

export const getQuestById = async (id:string): Promise<ApiResponse<Quest>>=>{
    try{
        const response: AxiosResponse = await apiClient.get(`/quests/${id}`);
        const result = response.data;

        return {
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

export const getQuestByIdForStage = async (stageId:string, userId:string): Promise<ApiResponse<Quest>>=>{
    try{
        const response: AxiosResponse = await apiClient.get(`/quests/stage/${stageId}/${userId}`);
        const result = response.data;

        return {
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

export const claimReward = async (questId: string, userId: string): Promise<ApiResponse<any>> => {
    try {
        // Sử dụng URLSearchParams để gửi query params cho request POST
        const params = new URLSearchParams();
        params.append('questId', questId);
        params.append('userId', userId);

        const response: AxiosResponse = await apiClient.post(`/rewards/claim-bonus?${params.toString()}`);
        const result = response.data;

        return {
            success: result.success ?? (result.status === 200),
            message: result.message,
            data: result.data,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.data) {
                const serverData = axiosError.response.data as any;
                return {
                    success: false,
                    error: serverData.message || `Lỗi ${axiosError.response.status}`,
                };
            }
            return { success: false, error: axiosError.message };
        }
        return { success: false, error: 'Đã xảy ra lỗi không xác định' };
    }
};

export const submitVisualChallenge = async (
    userId: string, 
    questId: string, 
    visualizationId: string, 
    answer: string
): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/visualizations/submit', {
        userId,
        questId,
        visualizationId,
        selectedAnswer: answer
    });
    return response.data;
};