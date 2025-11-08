import { useRef, useEffect, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";

interface User {
    id: string;
    userName: string;
    joinedAt: string;
    points: number;
}

export const useDrawingGame = (room: string, userName: string) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    const lastPointRef = useRef({ x: 0, y: 0 });
    const isDrawingRef = useRef(false);
    const socketRef = useRef<Socket | null>(null);

    // User management state
    const [users, setUsers] = useState<User[]>([]);

    // Game state
    const [currentWord, setCurrentWord] = useState<string>("ELEPHANT");
    const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set(['e', 'l', 'p']));
    const [isWordSelectionModalOpen, setIsWordSelectionModalOpen] = useState<boolean>(false);
    const [currentDrawer, setCurrentDrawer] = useState<string>("");

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

    // Socket connect
    useEffect(() => {
        const socket = io("http://localhost:3001", {
            query: { room, userName }
        });
        socketRef.current = socket;

        // Handle user updates
        socket.on("users:update", (userList: User[]) => {
            console.log("users:update", userList);
            setUsers(userList);
        });

        socket.on("user:joined", (user: User) => {
            console.log("user:joined", user);
            setUsers(prev => [...prev.filter(u => u.id !== user.id), { ...user, points: user.points || 0 }]);
        });

        socket.on("user:left", (user: { id: string }) => {
            setUsers(prev => prev.filter(u => u.id !== user.id));
        });

        // Receive segments from others
        socket.on("segment", ({ x0, y0, x1, y1, color, width }: { x0: number, y0: number, x1: number, y1: number, color: string, width: number }) => {
            const ctx = ctxRef.current;
            if (!ctx) return;
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        });

        // Clear from others
        socket.on("clear", () => {
            clearCanvas(true);
        });

        return () => {
            clearCanvas(true);
            socket.disconnect();
        };
    }, [room, userName]);

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

        if (emit && socketRef.current) {
            socketRef.current.emit("segment", {
                x0: p0.x,
                y0: p0.y,
                x1: p1.x,
                y1: p1.y,
                color,
                width,
                dpr: window.devicePixelRatio || 1,
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
        if (emit && socketRef.current) socketRef.current.emit("clear");
    };

    const handleWordSelect = (word: string) => {
        setCurrentWord(word);
        setGuessedLetters(new Set()); // Reset guessed letters
        setIsWordSelectionModalOpen(false);
        // TODO: Emit to socket that word was selected
    };

    const openWordSelectionModal = () => {
        setIsWordSelectionModalOpen(true);
    };

    const closeWordSelectionModal = () => {
        setIsWordSelectionModalOpen(false);
    };

    return {
        canvasRef,
        users,
        currentWord,
        guessedLetters,
        isWordSelectionModalOpen,
        currentDrawer,
        pointerDown,
        pointerMove,
        pointerUp,
        clearCanvas,
        handleWordSelect,
        openWordSelectionModal,
        closeWordSelectionModal,
    };
};
