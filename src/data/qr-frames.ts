export interface QRFrame {
    id: string;
    name: string;
    svg: (color: string, textColor: string, text: string) => string;
}

export const qrFrames: QRFrame[] = [
    {
        id: "none",
        name: "No Frame",
        svg: () => "",
    },
    {
        id: "simple-bottom",
        name: "Simple Bottom",
        svg: (color, textColor, text) => `
            <svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="100" height="100" fill="none" />
                <path d="M10,105 L90,105" stroke="${color}" stroke-width="2" />
                <text x="50" y="112" font-family="sans-serif" font-size="6" fill="${textColor}" text-anchor="middle" font-weight="bold">${text}</text>
            </svg>
        `
    },
    {
        id: "balloon-bottom",
        name: "Balloon",
        svg: (color, textColor, text) => `
            <svg viewBox="-10 -10 120 140" xmlns="http://www.w3.org/2000/svg">
                <path d="M5,5 H95 V95 H60 L50,110 L40,95 H5 Z" fill="${color}" />
                <text x="50" y="125" font-family="sans-serif" font-size="8" fill="${textColor}" text-anchor="middle" font-weight="bold">${text}</text>
            </svg>
        `
    },
    {
        id: "pro-border",
        name: "Pro Border",
        svg: (color, textColor, text) => `
            <svg viewBox="-5 -5 110 130" xmlns="http://www.w3.org/2000/svg">
                <rect x="-2" y="-2" width="104" height="104" rx="8" ry="8" stroke="${color}" stroke-width="4" fill="none" />
                <rect x="20" y="95" width="60" height="25" rx="12" ry="12" fill="${color}" />
                <text x="50" y="111" font-family="sans-serif" font-size="8" fill="${textColor}" text-anchor="middle" font-weight="bold">${text}</text>
            </svg>
        `
    },
    {
        id: "ribbon-top",
        name: "Ribbon Top",
        svg: (color, textColor, text) => `
            <svg viewBox="-10 -30 120 130" xmlns="http://www.w3.org/2000/svg">
                <path d="M10,-15 H90 L100,-5 L90,5 H10 L0,-5 L10,-15 Z" fill="${color}" />
                <text x="50" y="-2" font-family="sans-serif" font-size="7" fill="${textColor}" text-anchor="middle" font-weight="bold">${text}</text>
            </svg>
        `
    },
    {
        id: "phone",
        name: "Smartphone",
        svg: (color, textColor, text) => `
            <svg viewBox="-20 -30 140 160" xmlns="http://www.w3.org/2000/svg">
                <rect x="-10" y="-20" width="120" height="150" rx="15" ry="15" stroke="${color}" stroke-width="3" fill="none" />
                <circle cx="50" cy="120" r="5" stroke="${color}" stroke-width="2" fill="none" />
                <text x="50" y="-8" font-family="sans-serif" font-size="7" fill="${textColor}" text-anchor="middle" font-weight="bold">${text}</text>
            </svg>
        `
    }
];
