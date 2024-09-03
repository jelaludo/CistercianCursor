import rough from 'roughjs/bundled/rough.esm';

// Import the image
import parchmentBackground from './assets/parchment_background.jpg';

const CANVAS_SIZE = 150;
const MARGIN = 25;
const DRAWING_SIZE = CANVAS_SIZE - (2 * MARGIN);
const STROKE_WIDTH = 4;

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

type RoughCanvas = ReturnType<typeof rough.canvas>;

const drawLine = (rc: RoughCanvas, start: number, end: number) => {
    const [x1, y1] = getPointCoordinates(start);
    const [x2, y2] = getPointCoordinates(end);
    rc.line(x1, y1, x2, y2, { 
        roughness: 1.5, 
        strokeWidth: STROKE_WIDTH // Use the new STROKE_WIDTH constant
    });
};

export const drawCistercianNumeral = (canvas: HTMLCanvasElement, num: number) => {
    const ctx = canvas.getContext('2d')!;
    const rc = rough.canvas(canvas);

    // Load the parchment background image
    const img = new Image();
    img.onload = () => {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the parchment background
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Draw the main vertical line
        drawLine(rc, 2, 11);

        const digits = num.toString().padStart(4, '0').split('').map(Number);
        drawDigit(rc, digits[0], 'thousands');
        drawDigit(rc, digits[1], 'hundreds');
        drawDigit(rc, digits[2], 'tens');
        drawDigit(rc, digits[3], 'units');
    };
    img.src = parchmentBackground;
};

const drawDigit = (rc: RoughCanvas, digit: number, position: 'units' | 'tens' | 'hundreds' | 'thousands') => {
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
    lines.forEach(([start, end]) => drawLine(rc, start, end));
};