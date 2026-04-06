import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

// react query hook

// trả location hiện tại
const useLocation = () => {
    return useQuery({
        queryKey: ['location'],
        queryFn: async () => {
            const response = await api.get('/location/latest')
            return response.data
        }
    })
}

// trả lịch sử location để bỏ vào bảng ở /logs
const useLocationHistory = () => {
    return useQuery({
        queryKey: ['locationHistory'],
        queryFn: async () => {
            const response = await api.get('/location/history')
            return response.data
        }
    })
}


export { useLocation, useLocationHistory }