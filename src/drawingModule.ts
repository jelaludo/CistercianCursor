import rough from 'roughjs/bundled/rough.esm';
import parchmentBackground from './assets/parchment_background.jpg';

const CANVAS_SIZE = 300;
const MARGIN = 50;
const DRAWING_SIZE = CANVAS_SIZE - (2 * MARGIN);
const MAIN_STROKE_WIDTH = 6;
const SMALL_STROKE_WIDTH = 48;
const CALLIGRAPHY_ANGLE = Math.PI / 4;

export const getPointCoordinates = (point: number): [number, number] => {
    const coordinates: { [key: number]: [number, number] } = {
        1: [0, 0],
        2: [0.5, 0],
        3: [1, 0],
        4: [0, 0.33],
        5: [0.5, 0.33],
        6: [1, 0.33],
        7: [0, 0.67],
        8: [0.5, 0.67],
        9: [1, 0.67],
        10: [0, 1],
        11: [0.5, 1],
        12: [1, 1],
    };
    const [x, y] = coordinates[point];
    return [
        MARGIN + x * DRAWING_SIZE,
        MARGIN + y * DRAWING_SIZE
    ];
};

function drawCalligraphyLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, width: number, angle: number = Math.PI / 6) {
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const normalX = (y2 - y1) / length;
    const normalY = (x1 - x2) / length;

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const controlX = midX + (Math.random() - 0.5) * width * 2;
    const controlY = midY + (Math.random() - 0.5) * width * 2;

    ctx.beginPath();
    ctx.moveTo(x1 + normalX * width / 2, y1 + normalY * width / 2);
    ctx.quadraticCurveTo(controlX, controlY, x2 + normalX * width / 2, y2 + normalY * width / 2);
    
    // Create angled end
    ctx.lineTo(x2 + Math.cos(angle) * width / 2, y2 + Math.sin(angle) * width / 2);
    ctx.lineTo(x2 - normalX * width / 2, y2 - normalY * width / 2);
    ctx.lineTo(x1 - normalX * width / 2, y1 - normalY * width / 2);
    
    // Create angled start
    ctx.lineTo(x1 - Math.cos(angle) * width / 2, y1 - Math.sin(angle) * width / 2);
    ctx.closePath();
    ctx.fill();
}

const drawLine = (ctx: CanvasRenderingContext2D, start: number, end: number, strokeWidth: number) => {
    const [x1, y1] = getPointCoordinates(start);
    const [x2, y2] = getPointCoordinates(end);
    drawCalligraphyLine(ctx, x1, y1, x2, y2, strokeWidth, CALLIGRAPHY_ANGLE);
};

export const drawCistercianNumeral = (canvas: HTMLCanvasElement, num: number, scale: number = 1, isSmall: boolean = false) => {
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    
    // Set the actual size in memory
    canvas.width = CANVAS_SIZE * scale * dpr;
    canvas.height = CANVAS_SIZE * scale * dpr;
    
    // Scale the context to ensure correct drawing operations
    ctx.scale(dpr * scale, dpr * scale);
    
    // Set the "drawn" size of the canvas
    canvas.style.width = `${CANVAS_SIZE * scale}px`;
    canvas.style.height = `${CANVAS_SIZE * scale}px`;

    if (scale === 1 && !isSmall) {
        // Only draw background for full-size numerals
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
            drawNumeral(ctx, num, scale, isSmall);
        };
        img.src = parchmentBackground;
    } else {
        // For scaled-down numerals, use a beige background
        ctx.fillStyle = '#F5DEB3';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        drawNumeral(ctx, num, scale, isSmall);
    }
};

const drawNumeral = (ctx: CanvasRenderingContext2D, num: number, scale: number, isSmall: boolean) => {
    // Set the fill style for the calligraphy strokes
    ctx.fillStyle = 'black';

    const baseStrokeWidth = isSmall ? SMALL_STROKE_WIDTH : MAIN_STROKE_WIDTH;
    const adjustedStrokeWidth = baseStrokeWidth * (scale > 1 ? 1 : scale);
    
    // Draw the main vertical line
    drawLine(ctx, 2, 11, adjustedStrokeWidth);

    const digits = num.toString().padStart(4, '0').split('').map(Number);
    drawDigit(ctx, digits[0], 'thousands', adjustedStrokeWidth);
    drawDigit(ctx, digits[1], 'hundreds', adjustedStrokeWidth);
    drawDigit(ctx, digits[2], 'tens', adjustedStrokeWidth);
    drawDigit(ctx, digits[3], 'units', adjustedStrokeWidth);
};

const drawDigit = (ctx: CanvasRenderingContext2D, digit: number, position: 'units' | 'tens' | 'hundreds' | 'thousands', strokeWidth: number) => {
    const shapes: { [key: string]: { [key: number]: [number, number][] } } = {
        units: {
            1: [[2, 3]], 2: [[5, 6]], 3: [[2, 6]], 4: [[5, 3]], 5: [[2, 3], [5, 3]],
            6: [[3, 6]], 7: [[2, 3], [3, 6]], 8: [[5, 6], [3, 6]], 9: [[2, 3], [3, 6], [5, 6]]
        },
        tens: {
            1: [[1, 2]], 2: [[4, 5]], 3: [[4, 2]], 4: [[1, 5]], 5: [[1, 2], [1, 5]],
            6: [[1, 4]], 7: [[1, 2], [1, 4]], 8: [[1, 4], [4, 5]], 9: [[1, 2], [1, 4], [4, 5]]
        },
        hundreds: {
            1: [[11, 12]], 2: [[8, 9]], 3: [[11, 9]], 4: [[8, 12]], 5: [[8, 12], [11, 12]],
            6: [[9, 12]], 7: [[9, 12], [11, 12]], 8: [[9, 12], [8, 9]], 9: [[9, 12], [8, 9], [11, 12]]
        },
        thousands: {
            1: [[10, 11]], 2: [[7, 8]], 3: [[7, 11]], 4: [[10, 8]], 5: [[10, 8], [10, 11]],
            6: [[7, 10]], 7: [[7, 10], [10, 11]], 8: [[7, 10], [7, 8]], 9: [[7, 10], [7, 8], [10, 11]]
        }
    };

    const lines = shapes[position][digit] || [];
    lines.forEach(([start, end]) => drawLine(ctx, start, end, strokeWidth));
};