import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
    id: string;
    userName: string;
    message: string;
    timestamp: number;
    isSystem?: boolean;
    isCorrectGuess?: boolean;
    points?: number;
    position?: number;
}

interface ChatSidebarProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    currentUserName: string;
    isDrawer: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
    messages,
    onSendMessage,
    currentUserName,
    isDrawer
}) => {
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputMessage.trim() && !isDrawer) {
            onSendMessage(inputMessage.trim());
            setInputMessage('');
        }
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full shadow-lg">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="mr-2">💬</span>
                    Chat Room
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    {isDrawer ? 'You are drawing!' : 'Guess the word!'}
                </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <div className="text-4xl mb-2">💭</div>
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.isSystem ? 'justify-center' : message.isCorrectGuess ? 'justify-center' : message.userName === currentUserName ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.isSystem ? (
                                <div className="bg-gray-100 text-gray-600 text-sm px-3 py-2 rounded-full max-w-xs text-center">
                                    {message.message}
                                </div>
                            ) : message.isCorrectGuess ? (
                                <div className={`max-w-xs ${message.userName === currentUserName ? 'order-2' : 'order-1'}`}>
                                    <div
                                        className={`px-2 py-1 rounded-2xl text-xs font-medium ${
                                            message.userName === currentUserName
                                                ? 'bg-green-500 text-white'
                                                : 'bg-green-100 text-green-800'
                                        }`}
                                    >
                                        <span className="font-semibold">{message.userName}:</span> 🎉 Correct! +{message.points} points (#{message.position} place)
                                    </div>
                                    <div className={`text-xs text-gray-400 mt-1 px-3 ${
                                        message.userName === currentUserName ? 'text-right' : 'text-left'
                                    }`}>
                                        {formatTime(message.timestamp)}
                                    </div>
                                </div>
                            ) : (
                                <div className={`max-w-xs ${message.userName === currentUserName ? 'order-2' : 'order-1'}`}>
                                    <div
                                        className={`px-2 py-1 rounded-2xl text-xs ${
                                            message.userName === currentUserName
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        <span className="font-semibold">{message.userName}:</span> {message.message}
                                    </div>
                                    <div className={`text-xs text-gray-400 mt-1 px-3 ${
                                        message.userName === currentUserName ? 'text-right' : 'text-left'
                                    }`}>
                                        {formatTime(message.timestamp)}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                {isDrawer ? (
                    <div className="text-center text-gray-500 py-2">
                        <span className="text-sm">🎨 You're drawing - focus on your masterpiece!</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex space-x-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your guess..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black"
                            maxLength={100}
                        />
                        <button
                            type="submit"
                            disabled={!inputMessage.trim()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;
