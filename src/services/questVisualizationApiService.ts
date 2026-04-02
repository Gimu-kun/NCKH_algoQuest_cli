import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../types/apiType";
import axios from "axios";
import type { VisualBudgetSubmitRequestDto } from "../types/VisualizationSubmitType";
import apiClient from "./apiClient";

// Thêm interface để định nghĩa cấu trúc dữ liệu trả về từ server C++
export interface BudgetCompileResult {
    operations: number;
    status: "ok" | "limit_exceeded";
    time_ms?: number;
    cycles?: number;
    error?: string;
}

export const compileComplexityBudget = async (
    algorithms: string[],
    n: number,
    limit: number
): Promise<ApiResponse<BudgetCompileResult[]>> => {
    try {
        // Lưu ý: Thay đổi URL này cho đúng với endpoint server C++ của bạn
        // Nếu dùng proxy hoặc apiClient đã cấu hình base URL, hãy điều chỉnh lại
        const response: AxiosResponse = await axios.post("http://localhost:8081/api/comp_budget_compile", {
            algorithms,
            n,
            limit
        });
        
        const result = response.data;

        return {
            success: true,
            data: result, // result ở đây là mảng các BudgetCompileResult
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || "Lỗi kết nối Server biên dịch",
            };
        }
        return {
            success: false,
            error: "Đã xảy ra lỗi không xác định khi biên dịch",
        };
    }
};

export const submitBudgetChallenge = async (
    dto: VisualBudgetSubmitRequestDto
): Promise<ApiResponse<any>> => {
    try {
        console.log(dto)
        // Gọi đến endpoint mới đã tạo ở VisualizationController.java
        const response: AxiosResponse = await apiClient.post(
            "/visualizations/submit-budget-challenge", 
            dto
        );
        
        const result = response.data;
        console.log(response.data)
        return {
            success: true,
            status: result.status,
            message: result.message,
            data: result.data, // Chứa flag isFirstTime hoặc thông tin User mới
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const serverData = error.response?.data as any;
            return {
                success: false,
                error: serverData?.message || `Lỗi ${error.response?.status}: Thất bại khi gửi kết quả`,
            };
        }
        return {
            success: false,
            error: "Đã xảy ra lỗi không xác định khi kết nối Backend",
        };
    }
};