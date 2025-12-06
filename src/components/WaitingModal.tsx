import React from 'react';
import { Dialog } from '@headlessui/react';

interface WaitingModalProps {
    isOpen: boolean;
    drawerName: string;
}

const WaitingModal: React.FC<WaitingModalProps> = ({
    isOpen,
    drawerName
}) => {
    return (
        <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm" />

            {/* Full-screen container to center the panel */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⏳</span>
                        </div>
                        <Dialog.Title className="text-2xl font-bold text-gray-800 mb-2">
                            Waiting for Word Selection
                        </Dialog.Title>
                        <Dialog.Description className="text-gray-600">
                            <span className="font-semibold text-blue-600">{drawerName}</span> is choosing a word to draw!
                        </Dialog.Description>
                    </div>

                    {/* Loading Animation */}
                    <div className="flex justify-center mb-6">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Get ready to guess what they'll draw!
                        </p>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default WaitingModal;
