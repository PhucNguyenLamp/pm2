import { useInsideSafezone } from '@/hooks/useLocation'
import { socket } from '@/socket/socket';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react'
import { Toaster, toast } from 'react-hot-toast'

export default function Notification() {
    const queryClient = useQueryClient();
    const { data = { inside: true } } = useInsideSafezone();
    const inside = data.inside;
    const toastIdRef = useRef(null);

    useEffect(() => {
        console.log('insideSafezone', inside);

        if (!inside) {
            // only show one toast at a time
            if (!toastIdRef.current) {
                toastIdRef.current = toast.error('Your children is outside the safezone!', {
                    duration: Infinity,
                });
            }
        } else {
            // dismiss the toast when back inside
            if (toastIdRef.current) {
                toast.dismiss(toastIdRef.current);
                toastIdRef.current = null;
            }
        }
    }, [inside]);


    useEffect(() => {
        const handler = () => {
            queryClient.invalidateQueries(['insideSafezone']);
        };

        socket.on('location', handler);

        return () => {
            socket.off('location', handler);
        };
    }, [queryClient]);

    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
        />
    )
}
