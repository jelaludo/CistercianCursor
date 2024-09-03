import React, { useState, useEffect, useRef } from 'react';
import './CistercianNumeral.css';
import { drawCistercianNumeral } from './drawingModule';

const CANVAS_WIDTH = 150;
const CANVAS_HEIGHT = 150;

const CistercianNumeral: React.FC = () => {
    const [number, setNumber] = useState<string>('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.width = CANVAS_WIDTH;
            canvasRef.current.height = CANVAS_HEIGHT;
            drawCistercianNumeral(canvasRef.current, parseInt(number) || 0);
        }
    }, [number]);

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
            <canvas 
                ref={canvasRef} 
                width={CANVAS_WIDTH} 
                height={CANVAS_HEIGHT} 
                style={{ border: '1px solid black' }} 
            />
        </div>
    );
};

export default CistercianNumeral;