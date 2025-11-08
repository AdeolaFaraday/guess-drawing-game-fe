import { useParams, useNavigate } from 'react-router-dom';
import GameHeader from "../components/GameHeader";
import UserList from "../components/UserList";
import WordDisplay from "../components/WordDisplay";
import WordSelectionModal from "../components/WordSelectionModal";
import { useDrawingGame } from "../hooks/useDrawingGame";

const DrawingGame = () => {
    const { room, userName: encodedUserName } = useParams<{ room: string; userName: string }>();
    const navigate = useNavigate();

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
        pointerDown,
        pointerMove,
        pointerUp,
        handleWordSelect,
        openWordSelectionModal,
        closeWordSelectionModal
    } = useDrawingGame(roomCode, decodedUserName);

    // For demo purposes, assume current user is drawing
    const isCurrentUserDrawing = currentDrawer === decodedUserName || !currentDrawer;

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <GameHeader room={roomCode} userName={decodedUserName} onLeaveRoom={handleLeaveRoom} />

            {/* Main Content Area - Desktop: horizontal, Mobile: vertical */}
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-2 lg:p-4 gap-4 lg:gap-6 min-h-0">
                {/* User List - Desktop: left side, Mobile: top */}
                <div className="w-full lg:w-auto order-2 lg:order-1">
                    <UserList users={users} />
                </div>

                {/* Canvas Container - Desktop: right side, Mobile: bottom */}
                <div className="flex-1 max-w-4xl flex flex-col w-full order-1 lg:order-2">
                    <WordDisplay
                        currentWord={currentWord}
                        guessedLetters={guessedLetters}
                        isCurrentUserDrawing={isCurrentUserDrawing}
                    />

                    <div className="flex-1 flex items-center justify-center mt-2 lg:mt-0">
                        <canvas
                            id="drawing-canvas"
                            ref={canvasRef}
                            onPointerDown={pointerDown}
                            onPointerMove={pointerMove}
                            onPointerUp={pointerUp}
                            onPointerCancel={pointerUp}
                            onPointerLeave={pointerUp}
                            className="border border-gray-300 rounded-xl shadow-lg bg-white w-full h-full max-h-[50vh] lg:max-h-[60vh] touch-none"
                        />
                    </div>
                </div>
            </div>

            {/* Word Selection Modal */}
            <WordSelectionModal
                isOpen={isWordSelectionModalOpen}
                onWordSelect={handleWordSelect}
                onClose={closeWordSelectionModal}
            />

            {/* Temporary button to test modal - Remove in production */}
            <button
                onClick={openWordSelectionModal}
                className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-40"
            >
                Choose Word
            </button>
        </div>
    )
}

export default DrawingGame
