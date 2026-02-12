import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const useAIBuddy = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        // Connect to AI Buddy WebSocket
        const newSocket = io('http://localhost:3005', {
            withCredentials: true,
            transports: ['websocket'],
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to AI Buddy');
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
            console.log('Disconnected from AI Buddy');
        });

        newSocket.on('message-response', (data) => {
            setIsTyping(false);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    text: data.message || data.text || data,
                    sender: 'ai',
                    timestamp: new Date(),
                },
            ]);
        });

        newSocket.on('typing', () => {
            setIsTyping(true);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    const sendMessage = (message) => {
        if (!socket || !message.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: message,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);
        socket.emit('message', { message });
    };

    return {
        messages,
        sendMessage,
        isConnected,
        isTyping,
    };
};

export default useAIBuddy;
