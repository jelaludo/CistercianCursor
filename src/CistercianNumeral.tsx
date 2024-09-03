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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 9999)) {
            setNumber(value);
        }
    };

    return (
        <div className="cistercian-numeral-container">
            <label htmlFor="cistercian-input">Input # 0 to 9999</label>
            <input
                id="cistercian-input"
                type="number"
                value={number}
                onChange={handleInputChange}
                placeholder="0"
                min={0}
                max={9999}
            />
            <canvas 
                ref={canvasRef} 
                width={CANVAS_WIDTH} 
                height={CANVAS_HEIGHT} 
            />
        </div>
    );
};

export default CistercianNumeral;