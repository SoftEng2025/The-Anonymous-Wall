export const getAvatarUrl = (seed) => {
    // Return default anonymous avatar if no seed provided
    if (!seed || seed === 'anonymous') {
        return 'https://api.dicebear.com/9.x/bottts/svg?seed=anonymous';
    }
    // Return avatar URL based on given seed
    return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;
};
