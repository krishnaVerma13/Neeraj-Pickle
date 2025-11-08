/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
        extend: {
            scrollbar: false,
            fontFamily: {
                vegan: ["Dancing Script", "cursive"],
                heading: ["Bebas Neue", "sans-serif"],
                tagline: ["Sacramento", "cursive"],
            },
        },
    },
    plugins: [require("daisyui","tailwind-scrollbar-hide")],
    daisyui: {
        themes: ["light", "dark", "cupcake", "fantasy"], // you can choose or add custom themes
    },
}

