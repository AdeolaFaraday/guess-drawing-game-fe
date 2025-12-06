import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import GameHeader from "../components/GameHeader";
import UserList from "../components/UserList";
import WordDisplay from "../components/WordDisplay";
import WordSelectionModal from "../components/WordSelectionModal";
import WaitingModal from "../components/WaitingModal";
import ChatSidebar from "../components/ChatSidebar";
import ChatModal from "../components/ChatModal";
import { useDrawingGame } from "../hooks/useDrawingGame";

const DrawingGame = () => {
    const { room, userName: encodedUserName } = useParams<{ room: string; userName: string }>();
    const navigate = useNavigate();
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);

    // Decode the userName and provide fallbacks
    const decodedUserName = encodedUserName ? decodeURIComponent(encodedUserName) : '';
    const roomCode = room || '';

    const handleLeaveRoom = () => {
        navigate('/');
    };

    const {
        canvasRef,
        users,
        currentWord,
        guessedLetters,
        isWordSelectionModalOpen,
        currentDrawer,
        currentDrawerName,
        gameStarted,
        isWaitingForWord,
        isRoomCreator,
        chatMessages,
        timerRemaining,
        timerTotal,
        pointerDown,
        pointerMove,
        pointerUp,
        handleWordSelect,
        closeWordSelectionModal,
        startGame,
        sendMessage
    } = useDrawingGame(roomCode, decodedUserName);

    // Check if current user is the drawer
    const isCurrentUserDrawing = currentDrawer === users.find(u => u.userName === decodedUserName)?.id;

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <GameHeader
                room={roomCode}
                userName={decodedUserName}
                onLeaveRoom={handleLeaveRoom}
                isRoomCreator={isRoomCreator}
                gameStarted={gameStarted}
                onStartGame={startGame}
                timerRemaining={timerRemaining}
                timerTotal={timerTotal}
            />

            {/* Main Content Area - Desktop: horizontal with chat, Mobile: vertical */}
            <div className="flex-1 flex flex-col lg:flex-row p-2 lg:p-4 gap-4 lg:gap-6 min-h-0">
                {/* Left Section - User List and Canvas */}
                <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 min-h-0">
                    {/* User List - Desktop: left side, Mobile: top */}
                    <div className="w-full lg:w-auto order-2 lg:order-1">
                        <UserList users={users} />
                    </div>

                    {/* Canvas Container - Desktop: center, Mobile: bottom */}
                    <div className="flex-1 max-w-4xl flex flex-col w-full order-1 lg:order-2">
                        <WordDisplay
                            currentWord={currentWord}
                            guessedLetters={guessedLetters}
                            isCurrentUserDrawing={isCurrentUserDrawing}
                        />

                        <div className="flex-1 flex items-center justify-center mt-2 lg:mt-2">
                        <canvas
                            id="drawing-canvas"
                            ref={canvasRef}
                            onPointerDown={isCurrentUserDrawing ? pointerDown : undefined}
                            onPointerMove={isCurrentUserDrawing ? pointerMove : undefined}
                            onPointerUp={isCurrentUserDrawing ? pointerUp : undefined}
                            onPointerCancel={isCurrentUserDrawing ? pointerUp : undefined}
                            onPointerLeave={isCurrentUserDrawing ? pointerUp : undefined}
                            className={`border border-gray-300 rounded-xl shadow-lg bg-white w-full h-full max-h-[50vh] lg:max-h-[60vh] touch-none ${
                                !isCurrentUserDrawing ? 'cursor-not-allowed opacity-75' : 'cursor-crosshair'
                            }`}
                        />
                        </div>
                    </div>
                </div>

                {/* Chat Sidebar - Desktop only */}
                <div className="hidden lg:block">
                    <ChatSidebar
                        messages={chatMessages}
                        onSendMessage={sendMessage}
                        currentUserName={decodedUserName}
                        isDrawer={isCurrentUserDrawing}
                    />
                </div>
            </div>

            {/* Word Selection Modal */}
            <WordSelectionModal
                isOpen={isWordSelectionModalOpen}
                onWordSelect={handleWordSelect}
                onClose={closeWordSelectionModal}
            />

            {/* Waiting Modal */}
            <WaitingModal
                isOpen={isWaitingForWord}
                drawerName={currentDrawerName}
            />

            {/* Floating Chat Button - Mobile only */}
            <button
                onClick={() => setIsChatModalOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-40"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </button>

            {/* Chat Modal - Mobile only */}
            <ChatModal
                isOpen={isChatModalOpen}
                onClose={() => setIsChatModalOpen(false)}
                messages={chatMessages}
                onSendMessage={sendMessage}
                currentUserName={decodedUserName}
                isDrawer={isCurrentUserDrawing}
            />
        </div>
    )
}

export default DrawingGame
