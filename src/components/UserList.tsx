import React from 'react';

interface User {
    id: string;
    userName: string;
    joinedAt: string;
    points: number;
}

interface UserListProps {
    users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
    // Sort users by points descending
    const sortedUsers = [...users].sort((a, b) => b.points - a.points);

    return (
        <div className="w-full lg:w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-3 lg:p-4 h-fit max-h-48 lg:max-h-none overflow-y-auto">
            <div className="flex items-center space-x-2 mb-3 lg:mb-4">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs lg:text-sm font-bold">👥</span>
                </div>
                <h3 className="text-base lg:text-lg font-semibold text-gray-800">Players</h3>
                <span className="text-xs lg:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {users.length}
                </span>
            </div>

            <div className="space-y-2 lg:space-y-3">
                {sortedUsers.map((user, index) => (
                    <div
                        key={user.id}
                        className="flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-purple-50 transition-all duration-200 border border-gray-200 hover:border-blue-200"
                    >
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs lg:text-sm">
                                {index + 1}
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-xs lg:text-sm font-medium text-gray-900 truncate">
                                {user.userName}
                            </p>
                            <div className="flex items-center space-x-1">
                                <span className="text-xs text-gray-500">Points:</span>
                                <span className="text-xs lg:text-sm font-semibold text-blue-600">
                                    {user.points}
                                </span>
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>

            {users.length === 0 && (
                <div className="text-center py-6 lg:py-8">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
                        <span className="text-gray-400 text-base lg:text-lg">👤</span>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-500">No players yet</p>
                </div>
            )}
        </div>
    );
};

export default UserList;
