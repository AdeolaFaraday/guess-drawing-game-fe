import { useRef, useEffect, useCallback, useState } from "react";

// Define types based on the proto file
interface User {
    id: string;
    userName: string;
    points: number;
    joinedAt: string;
}

interface Position {
    x: number;
    y: number;
}

interface Segment {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    color: string;
    width: number;
    dpr: number;
}

interface TimerInfo {
    remaining: number;
    total: number;
}

interface ChatMessage {
    id: string;
    userName: string;
    message: string;
    timestamp: number;
    isCorrectGuess?: boolean;
    points?: number;
    position?: number;
}

interface CorrectGuess {
    userName: string;
    points: number;
    position: number;
    totalCorrect: number;
}

interface TurnStart {
    drawer: User;
    turnStartTime: number;
}

interface WordSelected {
    word: string;
    drawer: User;
}

interface JoinRequest {
    room: string;
    userName: string;
}

interface GameEvent {
    room: string;
    userId: string;
    join?: JoinRequest;
    segment?: Segment;
    cursor?: Position;
    clear?: string;
    wordSelect?: string;
    gameStart?: string;
    chatMessage?: string;
    usersUpdate?: User[];
    userJoined?: User;
    userLeft?: User;
    turnStart?: TurnStart;
    wordSelected?: WordSelected;
    timerUpdate?: TimerInfo;
    guessCorrect?: CorrectGuess;
    chatMessageResponse?: ChatMessage;
}

export const useDrawingGameGrpc = (room: string, userName: string) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    const lastPointRef = useRef({ x: 0, y: 0 });
    const isDrawingRef = useRef(false);

    // User management state
    const [users, setUsers] = useState<User[]>([]);

    // Game state
    const [currentWord, setCurrentWord] = useState<string>("");
    const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
    const [isWordSelectionModalOpen, setIsWordSelectionModalOpen] = useState<boolean>(false);
    const [currentDrawer, setCurrentDrawer] = useState<string>("");
    const [currentDrawerName, setCurrentDrawerName] = useState<string>("");
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [isWaitingForWord, setIsWaitingForWord] = useState<boolean>(false);

    // Timer state
    const [timerRemaining, setTimerRemaining] = useState<number>(0);
    const [timerTotal, setTimerTotal] = useState<number>(60);

    // Chat state
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const dpr = window.devicePixelRatio || 1;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.scale(dpr, dpr);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctxRef.current = ctx;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.style.width = "100%";
        canvas.style.height = "calc(100vh - 80px)"; // Account for header (60px) and padding (20px)
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [resizeCanvas]);

    // gRPC connection setup - using HTTP polling to simulate streaming
    useEffect(() => {
        console.log('Setting up gRPC-like connection');

        // For demonstration, we'll use HTTP requests to simulate gRPC calls
        // In a real implementation, this would be proper gRPC-web streaming

        let isConnected = true;
        let pollInterval: number;

        const sendEvent = async (event: Partial<GameEvent>) => {
            if (!isConnected) return;

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/grpc-event`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        room,
                        userId: 'temp-id',
                        ...event
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.events) {
                        result.events.forEach((gameEvent: GameEvent) => {
                            handleGameEvent(gameEvent);
                        });
                    }
                }
            } catch (error) {
                console.error('Error sending gRPC-like event:', error);
            }
        };

        // Send join request
        sendEvent({
            join: { room, userName }
        });

        // Poll for updates (simulating streaming)
        pollInterval = setInterval(async () => {
            if (!isConnected) return;

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/grpc-poll?room=${room}&userId=temp-id`);
                if (response.ok) {
                    const result = await response.json();
                    if (result.events) {
                        result.events.forEach((gameEvent: GameEvent) => {
                            handleGameEvent(gameEvent);
                        });
                    }
                }
            } catch (error) {
                console.error('Error polling for events:', error);
            }
        }, 100); // Poll every 100ms

        return () => {
            isConnected = false;
            if (pollInterval) {
                clearInterval(pollInterval);
            }
            clearCanvas(true);
        };
    }, [room, userName]);

    const handleGameEvent = (event: GameEvent) => {
        if (event.usersUpdate) {
            console.log("users:update", event.usersUpdate);
            setUsers(event.usersUpdate);
        } else if (event.userJoined) {
            console.log("user:joined", event.userJoined);
            setUsers(prev => [...prev.filter(u => u.id !== event.userJoined!.id), { ...event.userJoined!, points: event.userJoined!.points || 0 }]);
        } else if (event.userLeft) {
            setUsers(prev => prev.filter(u => u.id !== event.userLeft!.id));
        } else if (event.segment) {
            // Draw segment from another user
            const ctx = ctxRef.current;
            if (!ctx) return;
            const seg = event.segment;
            ctx.strokeStyle = seg.color;
            ctx.lineWidth = seg.width;
            ctx.beginPath();
            ctx.moveTo(seg.x0, seg.y0);
            ctx.lineTo(seg.x1, seg.y1);
            ctx.stroke();
        } else if (event.clear !== undefined) {
            clearCanvas(true);
        } else if (event.turnStart) {
            console.log("turn:start", event.turnStart.drawer, event.turnStart.turnStartTime);
            const drawer = event.turnStart.drawer;
            setCurrentDrawer(drawer.id);
            setCurrentDrawerName(drawer.userName);
            setCurrentWord("");
            setGuessedLetters(new Set());
            setGameStarted(true);
            clearCanvas(false); // Clear canvas locally without emitting

            // Check if current user is the drawer
            const isCurrentUserDrawer = drawer.userName === userName;
            if (isCurrentUserDrawer) {
                setIsWordSelectionModalOpen(true);
                setIsWaitingForWord(false);
            } else {
                setIsWordSelectionModalOpen(false);
                setIsWaitingForWord(true);
            }
        } else if (event.wordSelected) {
            console.log("word:selected", event.wordSelected.word, event.wordSelected.drawer);
            setCurrentWord(event.wordSelected.word);
            setGuessedLetters(new Set());
            setIsWordSelectionModalOpen(false);
            setIsWaitingForWord(false);
        } else if (event.chatMessageResponse) {
            console.log("chat:message", event.chatMessageResponse);
            setChatMessages(prev => [...prev, event.chatMessageResponse!]);
        } else if (event.timerUpdate) {
            console.log("timer:update", event.timerUpdate.remaining, event.timerUpdate.total);
            setTimerRemaining(event.timerUpdate.remaining);
            setTimerTotal(event.timerUpdate.total);
        } else if (event.guessCorrect) {
            // Handle correct guess - this would be part of chat message response
        }
    };

    const sendGameEvent = async (event: Partial<GameEvent>) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/grpc-event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    room,
                    userId: 'temp-id',
                    ...event
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.events) {
                    result.events.forEach((gameEvent: GameEvent) => {
                        handleGameEvent(gameEvent);
                    });
                }
            }
        } catch (error) {
            console.error('Error sending gRPC-like event:', error);
        }
    };

    const pointerDown = (e: any | PointerEvent) => {
        e.preventDefault();
        const pos = getPos(e);
        isDrawingRef.current = true;
        if (!pos) return;
        lastPointRef.current = pos;
    };

    const pointerMove = (e: any | PointerEvent) => {
        if (!isDrawingRef.current) return;
        const pos = getPos(e);
        if (!pos) return;
        drawSegment(lastPointRef.current, pos, "#FF0000", 3, true);
        lastPointRef.current = pos;
    };

    const pointerUp = () => {
        isDrawingRef.current = false;
    };

    const drawSegment = (p0: { x: number, y: number }, p1: { x: number, y: number }, color: string, width: number, emit: boolean) => {
        const ctx = ctxRef.current;
        if (!ctx) return;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();

        if (emit) {
            sendGameEvent({
                segment: {
                    x0: p0.x,
                    y0: p0.y,
                    x1: p1.x,
                    y1: p1.y,
                    color,
                    width,
                    dpr: window.devicePixelRatio || 1,
                }
            });
        }
    };

    const getPos = (e: any | PointerEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        // PointerEvents unify mouse/touch/pen
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const clearCanvas = (emit = true) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = ctxRef.current;
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // clears scaled buffer
        if (emit) sendGameEvent({ clear: "" });
    };

    const handleWordSelect = (word: string) => {
        sendGameEvent({ wordSelect: word });
        setCurrentWord(word);
        setGuessedLetters(new Set()); // Reset guessed letters
        setIsWordSelectionModalOpen(false);
    };

    const openWordSelectionModal = () => {
        setIsWordSelectionModalOpen(true);
    };

    const closeWordSelectionModal = () => {
        setIsWordSelectionModalOpen(false);
    };

    const startGame = () => {
        sendGameEvent({ gameStart: "" });
    };

    const sendMessage = (message: string) => {
        if (message.trim()) {
            sendGameEvent({ chatMessage: message.trim() });
        }
    };

    // Determine if current user is the room creator (first user in the list)
    const isRoomCreator = users.length > 0 && users[0].userName === userName;

    return {
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
        clearCanvas,
        handleWordSelect,
        openWordSelectionModal,
        closeWordSelectionModal,
        startGame,
        sendMessage,
    };
};
