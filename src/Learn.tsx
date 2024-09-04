import React, { useState, useEffect, useRef } from 'react';
import { drawCistercianNumeral } from './drawingModule';
import './Learn.css';

const Learn: React.FC = () => {
  const [number, setNumber] = useState<number>(0);
  const [pace, setPace] = useState<number>(0.5);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCountUp, setIsCountUp] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawCistercianNumeral(canvasRef.current, number);
    }
  }, [number]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setNumber(prev => {
          if (isCountUp) {
            return prev < 9999 ? prev + 1 : 0;
          } else {
            return prev > 0 ? prev - 1 : 9999;
          }
        });
      }, pace * 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isCountUp, pace]);

  const handleStart = () => {
    setIsRunning(true);
    setIsCountUp(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleCountUp = () => {
    setIsRunning(true);
    setIsCountUp(true);
  };

  const handlePaceChange = (increment: number) => {
    setPace(prev => Math.max(0.5, prev + increment));
  };

  return (
    <div className="learn-container">
      <input
        className="big-input"
        type="number"
        value={number}
        onChange={(e) => setNumber(Math.max(0, Math.min(9999, parseInt(e.target.value) || 0)))}
        placeholder="Enter a number (0-9999)"
      />
      <canvas ref={canvasRef} width={150} height={150} />
      <div className="controls">
        <button onClick={handleStart}>Start Countdown</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleCountUp}>Start Countup</button>
      </div>
      <div className="pace-control">
        <label>
          Pace (seconds):
          <div className="pace-input-container">
            <button onClick={() => handlePaceChange(-0.5)}>-</button>
            <input
              type="number"
              value={pace}
              onChange={(e) => setPace(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
              step="0.5"
              min="0.5"
            />
            <button onClick={() => handlePaceChange(0.5)}>+</button>
          </div>
        </label>
      </div>
    </div>
  );
};

export default Learn;