import React from 'react';
import { Dialog } from '@headlessui/react';
import { getRandomWords } from '../utils/drawingWords';

interface WordSelectionModalProps {
    isOpen: boolean;
    onWordSelect: (word: string) => void;
    onClose?: () => void;
}

const WordSelectionModal: React.FC<WordSelectionModalProps> = ({
    isOpen,
    onWordSelect,
    onClose
}) => {
    const [wordOptions, setWordOptions] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (isOpen) {
            // Get 3 random words for selection
            const words = getRandomWords(3);
            setWordOptions(words);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onClose={() => onClose?.()} className="relative z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm" />

            {/* Full-screen container to center the panel */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                    {/* Close button */}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}

                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🎨</span>
                        </div>
                        <Dialog.Title className="text-2xl font-bold text-gray-800 mb-2">
                            Choose Your Word!
                        </Dialog.Title>
                        <Dialog.Description className="text-gray-600">
                            Pick a word to draw. Other players will try to guess it!
                        </Dialog.Description>
                    </div>

                    {/* Word Options */}
                    <div className="space-y-3 mb-6">
                        {wordOptions.map((word, index) => (
                            <button
                                key={index}
                                onClick={() => onWordSelect(word)}
                                className="w-full p-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-2 border-blue-200 hover:border-blue-300 rounded-xl transition-all duration-200 transform hover:scale-105 group"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold text-gray-800 capitalize group-hover:text-blue-700">
                                        {word}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                                            {word.length} letters
                                        </span>
                                        <svg className="w-5 h-5 text-blue-500 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Choose wisely - you'll have to draw it clearly!
                        </p>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default WordSelectionModal;
