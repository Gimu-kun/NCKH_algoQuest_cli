import { useState, useCallback, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export const useBattleSocket = () => {
    const stompClientRef = useRef<Stomp.Client | null>(null);
    const [connected, setConnected] = useState(false);

    const connect = useCallback((
        roomId: string, 
        username: string, 
        onMessageReceived: (msg: any) => void,
        onConnectedCallback?: (client: Stomp.Client) => void
    ) => {
        // Tránh tạo nhiều kết nối trùng lặp
        if (stompClientRef.current?.connected) return;

        // Truyền username vào query để Backend định danh (Handshake)
        const socket = new SockJS(`http://localhost:8080/ws-algoquest?username=${username}`);
        const client = Stomp.over(socket);
        client.debug = () => {}; // Tắt log debug nếu muốn console sạch

        client.connect({}, () => {
            stompClientRef.current = client;
            setConnected(true);

            // 1. Nhận tin nhắn chung của phòng (Cập nhật danh sách, Start Game,...)
            client.subscribe(`/topic/room/${roomId}`, (payload) => {
                if (payload.body) {
                    onMessageReceived(JSON.parse(payload.body));
                }
            });

            // 2. Nhận lời mời cá nhân (Dành cho MainLayout bắt sự kiện)
            client.subscribe(`/user/queue/invites`, (payload) => {
                if (payload.body) {
                    const data = JSON.parse(payload.body);
                    window.dispatchEvent(new CustomEvent('battleInviteReceived', { detail: data }));
                }
            });

            if (onConnectedCallback) onConnectedCallback(client);
        }, (error) => {
            console.error("WebSocket Error:", error);
            setConnected(false);
            stompClientRef.current = null;
        });
    }, []);

    const sendMessage = useCallback((subPath: string, message: any, manualClient?: Stomp.Client) => {
        const activeClient = manualClient || stompClientRef.current;
        if (activeClient?.connected) {
            activeClient.send(`/app/${subPath}`, {}, JSON.stringify(message));
        }
    }, []);

    const disconnect = useCallback(() => {
        if (stompClientRef.current) {
            stompClientRef.current.disconnect(() => {
                setConnected(false);
                stompClientRef.current = null;
            });
        }
    }, []);

    return { connect, sendMessage, disconnect, connected };
};