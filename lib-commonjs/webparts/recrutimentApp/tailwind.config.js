// tailwind.config.js
export const theme = {
    extend: {
        keyframes: {
            spinner: {
                'to': { transform: 'rotate(1turn)' },
            }
        },
        animation: {
            'custom-spin': 'spinner 1s infinite steps(10)',
        }
    },
};