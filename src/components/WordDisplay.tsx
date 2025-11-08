import React from 'react';

interface WordDisplayProps {
    currentWord: string;
    guessedLetters: Set<string>;
    isCurrentUserDrawing?: boolean;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ currentWord, guessedLetters, isCurrentUserDrawing = false }) => {
    if (!currentWord) {
        return (
            <div className="flex items-center justify-center h-12 lg:h-16 bg-white rounded-lg shadow-md border border-gray-200 px-3 lg:px-6">
                <div className="flex items-center space-x-2 lg:space-x-3">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm lg:text-lg">🎨</span>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-500">Waiting for the next round...</p>
                </div>
            </div>
        );
    }

    // If user is drawing, show the full word
    if (isCurrentUserDrawing) {
        const displayWord = currentWord
            .split('')
            .map((letter, index) => (
                <span
                    key={index}
                    className="inline-block mx-0.5 text-lg lg:text-2xl font-bold text-green-600"
                >
                    {letter.toUpperCase()}
                </span>
            ));

        return (
            <div className="flex items-center justify-center h-12 lg:h-16 bg-white rounded-lg shadow-md border border-green-200 px-3 lg:px-6">
                <div className="flex items-center space-x-2 lg:space-x-4">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs lg:text-sm font-bold">✏️</span>
                    </div>

                    <div className="flex items-center space-x-1 lg:space-x-2">
                        {displayWord}
                    </div>

                    <div className="text-xs lg:text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full flex-shrink-0">
                        Draw this!
                    </div>
                </div>
            </div>
        );
    }

    // If user is guessing, show dashed word
    const displayWord = currentWord
        .split('')
        .map((letter, index) => {
            const isGuessed = guessedLetters.has(letter.toLowerCase());
            return (
                <span
                    key={index}
                    className={`inline-block mx-0.5 text-lg lg:text-2xl font-bold transition-all duration-300 ${
                        isGuessed
                            ? 'text-blue-600 transform scale-105'
                            : 'text-gray-400'
                    }`}
                >
                    {isGuessed ? letter.toUpperCase() : '_'}
                </span>
            );
        });

    const wordLength = currentWord.length;

    return (
        <div className="flex items-center justify-center h-12 lg:h-16 bg-white rounded-lg shadow-md border border-gray-200 px-3 lg:px-6">
            <div className="flex items-center space-x-2 lg:space-x-4">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs lg:text-sm font-bold">🎯</span>
                </div>

                <div className="flex items-center space-x-1 lg:space-x-2 overflow-x-auto">
                    {displayWord}
                </div>

                <div className="text-xs lg:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
                    ({wordLength})
                </div>
            </div>
        </div>
    );
};

export default WordDisplay;
