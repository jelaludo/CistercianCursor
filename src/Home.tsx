import React, { useState, useEffect, useRef } from 'react';
import { drawCistercianNumeral } from './drawingModule';
import './Home.css';

const CANVAS_SIZE = 300;

const Home: React.FC = () => {
    const [currentNumber, setCurrentNumber] = useState(0);
    const [counting, setCounting] = useState(false);
    const [countDirection, setCountDirection] = useState<'up' | 'down'>('up');
    const [speed, setSpeed] = useState(0.25);
    const [manualStart, setManualStart] = useState<number | ''>('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            drawCistercianNumeral(canvasRef.current, currentNumber);
        }
    }, [currentNumber]);

    useEffect(() => {
        if (counting) {
            startCounting();
        } else {
            stopCounting();
        }
        return () => stopCounting();
    }, [counting, countDirection, speed]);

    const startCounting = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrentNumber(prev => {
                const newNumber = countDirection === 'up' ? prev + 1 : prev - 1;
                return newNumber < 0 ? 0 : newNumber;
            });
        }, speed * 1000);
    };

    const stopCounting = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSpeed = parseFloat(e.target.value);
        if (!isNaN(newSpeed) && newSpeed > 0) {
            setSpeed(newSpeed);
        }
    };

    const handleSpeedIncrement = (increment: number) => {
        setSpeed(prev => Math.max(0.25, prev + increment));
    };

    const handleManualStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStart = parseInt(e.target.value);
        if (!isNaN(newStart) && newStart >= 0) {
            setManualStart(newStart);
        } else {
            setManualStart('');
        }
    };

    const startCountdown = () => {
        if (manualStart !== '') {
            setCurrentNumber(manualStart);
        }
        setCounting(true);
        setCountDirection('down');
    };

    return (
        <div className="home-container">
            <h1>Cistercian Numerals</h1>
            <canvas 
                ref={canvasRef} 
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                style={{ width: `${CANVAS_SIZE}px`, height: `${CANVAS_SIZE}px` }}
            />
            <div className="current-number">
                {currentNumber}
            </div>
            <div className="controls">
                <button onClick={() => { setCounting(true); setCountDirection('up'); }}>CountUp</button>
                <div className="countdown-controls">
                    <input
                        type="number"
                        value={manualStart}
                        placeholder="Input #"
                        onChange={handleManualStartChange}
                    />
                    <button onClick={startCountdown}>Countdown</button>
                </div>
                <button onClick={() => setCounting(false)}>Stop</button>
                <div className="speed-control">
                    <label htmlFor="speed">Speed (seconds):</label>
                    <input
                        type="number"
                        id="speed"
                        value={speed}
                        step="0.25"
                        min="0.25"
                        onChange={handleSpeedChange}
                    />
                    <button onClick={() => handleSpeedIncrement(0.25)}>+</button>
                    <button onClick={() => handleSpeedIncrement(-0.25)}>-</button>
                </div>
            </div>
        </div>
    );
};

export default Home;