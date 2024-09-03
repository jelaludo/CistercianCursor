import React, { useState, useEffect, useRef } from 'react';
import './CistercianNumeral.css';

const CistercianNumeral: React.FC = () => {
    const [number, setNumber] = useState<string>('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        drawCistercianNumeral(parseInt(number) || 0);
    }, [number]);

    const getPointCoordinates = (point: number): [number, number] => {
        const coordinates: { [key: number]: [number, number] } = {
            1: [25, 0],
            2: [75, 0],
            3: [125, 0],
            4: [25, 50],
            5: [75, 50],
            6: [125, 50],
            7: [25, 100],
            8: [75, 100],
            9: [125, 100],
            10: [25, 150],
            11: [75, 150],
            12: [125, 150],
        };
        return coordinates[point];
    };

    const drawLine = (ctx: CanvasRenderingContext2D, start: number, end: number) => {
        const [x1, y1] = getPointCoordinates(start);
        const [x2, y2] = getPointCoordinates(end);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    };

    const drawDigit = (ctx: CanvasRenderingContext2D, digit: number, position: 'units' | 'tens' | 'hundreds' | 'thousands') => {
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
        lines.forEach(([start, end]) => drawLine(ctx, start, end));
    };

    const drawCistercianNumeral = (num: number) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;

                // Draw the main vertical line
                drawLine(ctx, 2, 11);

                const digits = num.toString().padStart(4, '0').split('').map(Number);
                drawDigit(ctx, digits[0], 'thousands');
                drawDigit(ctx, digits[1], 'hundreds');
                drawDigit(ctx, digits[2], 'tens');
                drawDigit(ctx, digits[3], 'units');
            }
        }
    };

    return (
        <div className="cistercian-numeral-container">
            <input
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Enter a number (0-9999)"
                min={0}
                max={9999}
            />
            <canvas ref={canvasRef} width={150} height={150} />
        </div>
    );
};

export default CistercianNumeral;