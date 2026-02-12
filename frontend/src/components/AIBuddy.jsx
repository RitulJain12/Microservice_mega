import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import useAIBuddy from '../hooks/useAIBuddy';
import { useAuth } from '../context/AuthContext';
import './AIBuddy.css';

const AIBuddy = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);
    const { messages, sendMessage, isConnected, isTyping } = useAIBuddy();
    const { user } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (inputMessage.trim()) {
            sendMessage(inputMessage);
            setInputMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!user) return null;

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="ai-buddy-float-btn"
                >
                    <Sparkles size={28} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="ai-buddy-window">
                    {/* Header */}
                    <div className="ai-buddy-header">
                        <div className="ai-buddy-header-info">
                           <Sparkles size={24} className="ai-buddy-header-icon" />
                            <div>
                                <h3 className="ai-buddy-header-title">AI Buddy</h3>
                                <p className="ai-buddy-header-status">
                                    {isConnected ? 'Online' : 'Connecting...'}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="ai-buddy-close-btn">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="ai-buddy-messages">
                        {messages.length === 0 && (
                            <div className="ai-buddy-welcome">
                                <Sparkles className="ai-buddy-welcome-icon" size={48} />
                                <p className="ai-buddy-welcome-title">Hi! I'm your AI Buddy</p>
                                <p className="ai-buddy-welcome-text">Ask me to find products or add items to your cart!</p>
                                <div className="ai-buddy-suggestions">
                                    <p className="ai-buddy-suggestions-label">Try asking:</p>
                                    <div className="ai-buddy-suggestion">"Find me wireless headphones"</div>
                                    <div className="ai-buddy-suggestion">"Add a laptop to my cart"</div>
                                </div>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div key={message.id} className={`ai-buddy-message ${message.sender}`}>
                                <div className="ai-buddy-message-bubble">
                                    <p className="ai-buddy-message-text">{message.text}</p>
                                    <p className="ai-buddy-message-time">
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="ai-buddy-typing">
                                <div className="ai-buddy-typing-bubble">
                                    <div className="ai-buddy-typing-dots">
                                        <div className="ai-buddy-typing-dot"></div>
                                        <div className="ai-buddy-typing-dot"></div>
                                        <div className="ai-buddy-typing-dot"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="ai-buddy-input-area">
                        <div className="ai-buddy-input-wrapper">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything..."
                                className="ai-buddy-input"
                                disabled={!isConnected}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputMessage.trim() || !isConnected}
                                className="ai-buddy-send-btn"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIBuddy;
