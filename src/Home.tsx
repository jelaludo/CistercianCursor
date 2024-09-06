import React, { useState, useEffect, useRef, useMemo } from 'react';
import { drawCistercianNumeral } from './drawingModule';
import './Home.css';
import { debounce } from 'lodash'; // You may need to install lodash

const CANVAS_SIZE = 300;

const Home: React.FC = () => {
    const [currentNumber, setCurrentNumber] = useState(0);
    const [counting, setCounting] = useState(false);
    const [countDirection, setCountDirection] = useState<'up' | 'down'>('up');
    const [speed, setSpeed] = useState(0.25);
    const [manualStart, setManualStart] = useState<number | ''>('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const lastUpdateTimeRef = useRef(0);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        // Load background image once
        if (backgroundRef.current) {
            backgroundRef.current.style.backgroundImage = 'url(path/to/your/background-image.jpg)';
            backgroundRef.current.style.backgroundSize = 'cover';
            backgroundRef.current.style.backgroundPosition = 'center';
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    const memoizedDrawing = useMemo(() => {
        if (canvasRef.current) {
            return () => drawCistercianNumeral(canvasRef.current!, currentNumber);
        }
        return () => {}; // Return a no-op function if canvas ref is null
    }, [currentNumber]);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
                memoizedDrawing(); // Call the memoized drawing function
            }
        }
    }, [memoizedDrawing]);

    const updateNumber = (timestamp: number) => {
        if (timestamp - lastUpdateTimeRef.current >= speed * 1000) {
            setCurrentNumber(prev => {
                const newNumber = countDirection === 'up' ? prev + 1 : prev - 1;
                return newNumber < 0 ? 0 : newNumber;
            });
            lastUpdateTimeRef.current = timestamp;
        }
        if (counting) {
            animationFrameRef.current = requestAnimationFrame(updateNumber);
        }
    };

    useEffect(() => {
        if (counting) {
            animationFrameRef.current = requestAnimationFrame(updateNumber);
        } else {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }
        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [counting, countDirection, speed]);

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

    const handleStop = () => {
        setCounting(false);
    };

    return (
        <div className="home-container" ref={backgroundRef}>
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
                <button onClick={handleStop}>Stop</button>
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