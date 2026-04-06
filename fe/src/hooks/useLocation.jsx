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

// update safezone
const useUpdateSafezone = () => {

}

// trả về các safezones, sau đó hiện lên trên bảng đồ
const useSafezones = () => {
    //
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