export const getAvatarUrl = (seed) => {
    if (!seed || seed === 'anonymous') {
        return 'https://api.dicebear.com/9.x/bottts/svg?seed=anonymous';
    }
    return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;
};