import React from 'react';

interface GameHeaderProps {
    room: string;
    userName: string;
    onLeaveRoom: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ room, userName, onLeaveRoom }) => {
    return (
        <div className="flex items-center justify-between px-3 lg:px-4 py-2 lg:py-3 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2 lg:space-x-4">
                <div>
                    <span className="text-xs lg:text-sm font-medium text-gray-600">Room:</span>
                    <span className="ml-1 text-xs lg:text-sm font-semibold text-indigo-600">{room}</span>
                </div>
                <div className="text-xs lg:text-sm text-gray-500 hidden sm:block">
                    Welcome, <span className="font-medium text-gray-700">{userName}</span>
                </div>
                <div className="text-xs text-gray-500 sm:hidden">
                    <span className="font-medium text-gray-700">{userName}</span>
                </div>
            </div>
            <button
                onClick={onLeaveRoom}
                className="px-2 lg:px-3 py-1 lg:py-1.5 text-xs lg:text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
                Leave
            </button>
        </div>
    );
};

export default GameHeader;
