import api from "@/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// react query hook

// trả location hiện tại
const useLocation = () => {
    return useQuery({
        queryKey: ['location'],
        queryFn: async () => {
            const response = await api.get('/locations/current')
            return response.data
        }
    })
}

// tạo safezone hình chữ nhật
const useCreateRectangleSafezone = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (rectangle) => {
            await api.post('/safezones/rectangle', rectangle)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['insideSafezone'])
        }
    })
}

// tạo safezone hình tròn
const useCreateCircleSafezone = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (circle) => {
            await api.post('/safezones/circle', circle)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['insideSafezone'])
        }
    })
}

// trả về 2 safezones, sau đó hiện lên trên bảng đồ
const useSafezones = () => {
    //
    return useQuery({
        queryKey: ['safezones'],
        queryFn: async () => {
            const response = await api.get('/safezones')
            return response.data
        }
    })
}

// trả lịch sử location để bỏ vào bảng ở /logs
const useLocationHistory = () => {
    return useQuery({
        queryKey: ['locationHistory'],
        queryFn: async () => {
            const response = await api.get('/locations/locations')
            return response.data
        }
    })
}

const useInsideSafezone = () => {
    return useQuery({
        queryKey: ['insideSafezone'],
        queryFn: async () => {
            const response = await api.post('/safezones/inside', location)
            console.log('Checked safezone status:', response.data)
            return response.data
        }
    })
}

export { useLocation, useLocationHistory, useCreateRectangleSafezone, useCreateCircleSafezone, useSafezones, useInsideSafezone }