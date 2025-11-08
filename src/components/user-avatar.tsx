import React from 'react';

interface UserAvatarProps {
    userId: string;
    userName?: string;
    size?: number;
    showStatus?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
    userId,
    userName,
    size = 40,
    showStatus = true
}) => {
    // Generate consistent color based on userId
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];

    const getColorFromId = (id: string) => {
        if (!id) return colors[0];
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const getInitials = (name?: string) => {
        if (!name) return userId.slice(0, 2).toUpperCase();
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const backgroundColor = getColorFromId(userId);
    const initials = getInitials(userName);

    return (
        <div className="relative inline-block mx-1">
            <div
                className="flex items-center justify-center text-white font-bold border-2 border-white shadow-lg cursor-pointer select-none transition-all duration-200 ease-in-out hover:scale-110 hover:shadow-xl"
                style={{
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    backgroundColor,
                    fontSize: size * 0.4,
                    fontFamily: 'Arial, sans-serif'
                }}
                title={userName || `User ${userId.slice(0, 6)}`}
            >
                {initials}
            </div>
            {showStatus && (
                <div
                    className="absolute -bottom-0.5 -right-0.5 bg-green-500 border-2 border-white shadow-md"
                    style={{
                        width: size * 0.3,
                        height: size * 0.3,
                        borderRadius: '50%'
                    }}
                />
            )}
        </div>
    );
};

export default UserAvatar;