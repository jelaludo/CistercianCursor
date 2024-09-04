import React, { useState, useEffect, useRef } from 'react';
import './CistercianLearn.css';
import { drawCistercianNumeral } from './drawingModule';

const MAIN_CANVAS_SIZE = 300;
const SMALL_CANVAS_SIZE = MAIN_CANVAS_SIZE * 0.2; // 20% of the main size
const SMALL_SCALE = 0.2; // 20% scale for drawing

const CistercianLearn: React.FC = () => {
    const [number, setNumber] = useState<string>('');
    const mainCanvasRef = useRef<HTMLCanvasElement>(null);
    const smallCanvasRefs = useRef<(HTMLCanvasElement | null)[]>(new Array(9).fill(null));

    useEffect(() => {
        if (mainCanvasRef.current) {
            drawCistercianNumeral(mainCanvasRef.current, parseInt(number) || 0);
        }
    }, [number]);

    useEffect(() => {
        smallCanvasRefs.current.forEach((canvas, index) => {
            if (canvas) {
                drawCistercianNumeral(canvas, index + 1, SMALL_SCALE, true);
            }
        });
    }, []);

    return (
        <div className="cistercian-learn-container">
            <h2>Learn Cistercian Numerals</h2>
            <div className="main-numeral">
                <label htmlFor="cistercian-input">Enter a number (0-9999):</label>
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
                    ref={mainCanvasRef} 
                    width={MAIN_CANVAS_SIZE}
                    height={MAIN_CANVAS_SIZE}
                />
            </div>
            <div className="small-numerals-section">
                <h3>Units (1-9)</h3>
                <div className="small-numerals-container">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, index) => (
                        <div key={num} className="small-numeral">
                            <canvas
                                ref={el => smallCanvasRefs.current[index] = el}
                                width={SMALL_CANVAS_SIZE}
                                height={SMALL_CANVAS_SIZE}
                            />
                            <span>{num}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CistercianLearn;