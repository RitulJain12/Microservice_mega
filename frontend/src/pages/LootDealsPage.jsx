import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Loader } from 'lucide-react';
import api from '../config/api';
import ProductCard from '../components/ProductCard';
import useAIBuddy from '../hooks/useAIBuddy';
import { useAuth } from '../context/AuthContext';
import './LootDealsPage.css';

const LootDealsPage = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);
    const { messages, sendMessage, isConnected, isTyping } = useAIBuddy();

    useEffect(() => {
        fetchPremiumDeals();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const fetchPremiumDeals = async () => {
        try {
            // Try fetching from recommendation service first
            const response = await api.get('/recommendations/premium-discounts?limit=100');
            if (response.data && response.data.length > 0) {
                setProducts(response.data);
            } else {
                // Fallback: Fetch directly from product service if no recommendations
                console.log("No recommendations found, fetching discounted products directly.");
                const fallbackResponse = await api.get('/product/api/product/discounted?limit=100');
                setProducts(fallbackResponse.data.products || []);
            }
        } catch (error) {
            console.error('Failed to fetch premium deals, trying fallback:', error);
            try {
                // Fallback on error as well
                const fallbackResponse = await api.get('/product/api/product/discounted?limit=100');
                setProducts(fallbackResponse.data.products || []);
            } catch (fallbackError) {
                console.error('Fallback fetch failed:', fallbackError);
                setProducts([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

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

    return (
        <div className="loot-deals-page">
            <div className="loot-header">
                <Sparkles className="loot-icon" size={32} />
                <h1>Premium Loot Deals</h1>
                <p>Exclusive discounts and AI assistance for our premium members.</p>
            </div>

            <div className="loot-content">
                {/* Left Side: Product Grid */}
                <div className="loot-products-section">
                    <h2>Hot<span style={{color:'white'}}>Deals</span></h2>
                    {loading ? (
                        <div className="loading-state">
                            <Loader className="animate-spin" size={32} />
                            <p>Finding best deals...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <p>No exclusive deals found right now.</p>
                    ) : (
                        <div className="loot-grid">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side: AI Chat */}
                <div className="loot-chat-section">
                    <div className="chat-header">
                        <h3>Premium <span style={{color:'white'}}>AI Assistant</span></h3>
                    </div>

                    <div className="chat-messages">
                        {messages.length === 0 && (
                            <div className="chat-welcome">
                                <p>I'm your Personal Shopper.</p>
                                <p>I can find specific items and add them to your cart instantly!</p>
                                <p className="chat-tip">Try: "Find me cheap gaming mouse" or "Add the red shoes to cart"</p>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div key={message.id} className={`chat-message ${message.sender}`}>
                                <div className="message-content">
                                    <p>{message.text}</p>
                                    <span className="message-time">
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="chat-typing">
                                <span>AI is thinking...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-area">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask AI to find or add items..."
                            disabled={!isConnected}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputMessage.trim() || !isConnected}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LootDealsPage;
