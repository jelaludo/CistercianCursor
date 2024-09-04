import React, { useState, useEffect, useRef } from 'react';
import './CistercianNumeral.css';
import { drawCistercianNumeral } from './drawingModule';

const CANVAS_WIDTH = 150;
const CANVAS_HEIGHT = 150;
const CANVAS_SIZE = 300; // Match this with the CANVAS_SIZE in drawingModule.ts


const CistercianNumeral: React.FC = () => {
    const [number, setNumber] = useState<string>('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const drawNumeral = () => {
            if (canvasRef.current) {
                drawCistercianNumeral(canvasRef.current, parseInt(number) || 0);
            }
        };

        drawNumeral();

        // Redraw after a short delay to ensure the background has loaded
        const timer = setTimeout(drawNumeral, 100);

        return () => clearTimeout(timer);
    }, [number]);

    return (
        <div className="cistercian-numeral-container">
            <label htmlFor="cistercian-input" style={{ color: 'white' }}>Input # 0 to 9999</label>
            <input
                id="cistercian-input"
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="0"
                min={0}
                max={9999}
            />
            <canvas 
                ref={canvasRef} 
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                style={{ width: `${CANVAS_SIZE}px`, height: `${CANVAS_SIZE}px` }}
            />
        </div>
    );
};

export default CistercianNumeral;