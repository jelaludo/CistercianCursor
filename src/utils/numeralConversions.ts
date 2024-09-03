export const toJapaneseNumerals = (num: number): string => {
    const japaneseNumerals = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const units = ['', '十', '百', '千'];
    let result = '';
    let unitIndex = 0;

    while (num > 0) {
        const digit = num % 10;
        if (digit > 0) {
            result = (digit > 1 || unitIndex === 0 ? japaneseNumerals[digit] : '') + units[unitIndex] + result;
        }
        num = Math.floor(num / 10);
        unitIndex++;
    }

    return result || '〇';
};

export const toRomanNumerals = (num: number): string => {
    const romanNumerals: { [key: number]: string } = {
        1000: 'M', 900: 'CM', 500: 'D', 400: 'CD', 100: 'C', 90: 'XC', 50: 'L', 40: 'XL', 10: 'X', 9: 'IX', 5: 'V', 4: 'IV', 1: 'I'
    };
    let result = '';
    for (const value of Object.keys(romanNumerals).map(Number).sort((a, b) => b - a)) {
        while (num >= value) {
            result += romanNumerals[value];
            num -= value;
        }
    }
    return result;
};

export const toAncientGreekNumerals = (num: number): string => {
    const greekNumerals: { [key: number]: string } = {
        1: 'α', 2: 'β', 3: 'γ', 4: 'δ', 5: 'ε', 6: 'ϛ', 7: 'ζ', 8: 'η', 9: 'θ',
        10: 'ι', 20: 'κ', 30: 'λ', 40: 'μ', 50: 'ν', 60: 'ξ', 70: 'ο', 80: 'π', 90: 'ϟ',
        100: 'ρ', 200: 'σ', 300: 'τ', 400: 'υ', 500: 'φ', 600: 'χ', 700: 'ψ', 800: 'ω', 900: 'ϡ'
    };
    let result = '';
    const keys = Object.keys(greekNumerals).map(Number).sort((a, b) => b - a);
    for (const key of keys) {
        while (num >= key) {
            result += greekNumerals[key];
            num -= key;
        }
    }
    return result;
};

export const toBrailleNumerals = (num: number): string => {
    const brailleNumerals = ['⠴', '⠂', '⠆', '⠒', '⠲', '⠢', '⠖', '⠶', '⠦', '⠔'];
    return num.toString().split('').map(digit => brailleNumerals[parseInt(digit)]).join('');
};

export const toBinary = (num: number): string => {
    return num.toString(2);
};