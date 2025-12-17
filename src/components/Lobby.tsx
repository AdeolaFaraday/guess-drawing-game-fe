import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

interface RoomInfo {
    userCount: number;
    users: Array<{ id: string; userName: string; joinedAt: string }>;
}

const Lobby: React.FC = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
    const [isCheckingRoom, setIsCheckingRoom] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [tempSocket, setTempSocket] = useState<Socket | null>(null);

    // Generate a unique room code
    const generateRoomCode = () => {
        const adjectives = ['Cosmic', 'Digital', 'Creative', 'Virtual', 'Infinite', 'Quantum', 'Pixel', 'Astral'];
        const nouns = ['Canvas', 'Studio', 'Workshop', 'Lab', 'Space', 'Hub', 'Zone', 'Realm'];
        const randomNum = Math.floor(Math.random() * 1000);

        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];

        return `${adjective}-${noun}-${randomNum}`;
    };

    // Check room occupancy
    const checkRoomInfo = async (room: string) => {
        if (!room.trim()) return;

        setIsCheckingRoom(true);
        const socket = io(import.meta.env.VITE_BACKEND_URL, {
            query: { room, userName: 'temp-checker' }
        });

        socket.on("users:update", (users: RoomInfo['users']) => {
            setRoomInfo({ userCount: users.length, users });
            setTempSocket(socket);
            setIsCheckingRoom(false);
        });

        // Timeout after 2 seconds
        setTimeout(() => {
            if (isCheckingRoom) {
                setIsCheckingRoom(false);
                setRoomInfo(null);
                socket.disconnect();
            }
        }, 2000);
    };

    // Handle room code input change
    const handleRoomCodeChange = (value: string) => {
        setRoomCode(value);
        setRoomInfo(null);

        // Debounce room checking
        const timeoutId = setTimeout(() => {
            if (value.trim()) {
                checkRoomInfo(value);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    // Generate new room and join
    const handleGenerateRoom = () => {
        setIsGenerating(true);
        const newRoomCode = generateRoomCode();
        setRoomCode(newRoomCode);

        // Simulate generation delay for better UX
        setTimeout(() => {
            setIsGenerating(false);
            checkRoomInfo(newRoomCode);
        }, 800);
    };

    // Join room
    const handleJoinRoom = () => {
        if (!userName.trim() || !roomCode.trim()) return;

        if (tempSocket) {
            tempSocket.disconnect();
        }

        // Navigate to the game page with room and userName as URL params
        navigate(`/game/${roomCode.trim()}/${encodeURIComponent(userName.trim())}`);
    };

    // Cleanup socket on unmount
    useEffect(() => {
        return () => {
            if (tempSocket) {
                tempSocket.disconnect();
            }
        };
    }, [tempSocket]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl mb-4 shadow-lg">
                        <span className="text-2xl">🎨</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Guess Drawing Game
                    </h1>
                    <p className="text-gray-600">
                        Draw, guess, and play together in real-time
                    </p>
                </div>

                {/* Main Form */}
                <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
                    {/* User Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                            maxLength={20}
                        />
                    </div>

                    {/* Room Code Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Room Code
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={roomCode}
                                onChange={(e) => handleRoomCodeChange(e.target.value)}
                                placeholder="Enter room code"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                            />
                            <button
                                onClick={handleGenerateRoom}
                                disabled={isGenerating}
                                className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {isGenerating ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <span className="text-lg">🎲</span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Room Preview */}
                    {roomCode && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Room: {roomCode}
                                </span>
                                {isCheckingRoom && (
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                        <span>Checking...</span>
                                    </div>
                                )}
                            </div>

                            {roomInfo && (
                                <div className="flex items-center space-x-2">
                                    <div className="flex -space-x-2">
                                        {roomInfo.users.slice(0, 3).map((user, index) => (
                                            <div
                                                key={user.id}
                                                className="w-6 h-6 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                                                style={{ zIndex: 3 - index }}
                                            >
                                                {user.userName.charAt(0).toUpperCase()}
                                            </div>
                                        ))}
                                        {roomInfo.userCount > 3 && (
                                            <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                                                +{roomInfo.userCount - 3}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {roomInfo.userCount} {roomInfo.userCount === 1 ? 'person' : 'people'} online
                                    </span>
                                </div>
                            )}

                            {!isCheckingRoom && !roomInfo && roomCode && (
                                <div className="text-sm text-amber-600 flex items-center space-x-2">
                                    <span>⚠️</span>
                                    <span>Room not found or empty</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Join Button */}
                    <button
                        onClick={handleJoinRoom}
                        disabled={!userName.trim() || !roomCode.trim()}
                        className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                    >
                        {isGenerating ? 'Generating Room...' : 'Join Drawing Game'}
                    </button>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        Share the room code with others to collaborate
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Lobby;
